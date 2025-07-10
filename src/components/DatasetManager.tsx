
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Star, Upload, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConversationEntry {
  id: string;
  title: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  }>;
  metadata: {
    intent: string;
    outcome: string;
    final_price?: number;
    business_type: string;
    complexity: "low" | "medium" | "high";
    tags: string[];
  };
  created_at: string;
  is_favorite: boolean;
}

export function DatasetManager() {
  const [entries, setEntries] = useState<ConversationEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ConversationEntry | null>(null);
  const { toast } = useToast();

  // Load entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("dealMindEntries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem("dealMindEntries", JSON.stringify(entries));
  }, [entries]);

  const createNewEntry = () => {
    const newEntry: ConversationEntry = {
      id: crypto.randomUUID(),
      title: "New Negotiation",
      messages: [
        {
          role: "user",
          content: "I'm interested in your product, but the price seems a bit high.",
          timestamp: new Date().toISOString(),
        },
        {
          role: "assistant",
          content: "I understand your concern. Let me see what I can do for you. What price range were you thinking?",
          timestamp: new Date().toISOString(),
        },
      ],
      metadata: {
        intent: "discount_request",
        outcome: "in_progress",
        business_type: "retail",
        complexity: "medium",
        tags: [],
      },
      created_at: new Date().toISOString(),
      is_favorite: false,
    };
    
    setEditingEntry(newEntry);
    setIsCreateDialogOpen(true);
  };

  const saveEntry = (entry: ConversationEntry) => {
    if (entries.find(e => e.id === entry.id)) {
      setEntries(prev => prev.map(e => e.id === entry.id ? entry : e));
    } else {
      setEntries(prev => [...prev, entry]);
    }
    toast({
      title: "Entry saved",
      description: "Conversation entry has been saved successfully.",
    });
    setIsCreateDialogOpen(false);
    setEditingEntry(null);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    toast({
      title: "Entry deleted",
      description: "Conversation entry has been removed.",
    });
  };

  const toggleFavorite = (id: string) => {
    setEntries(prev => prev.map(e => 
      e.id === id ? { ...e, is_favorite: !e.is_favorite } : e
    ));
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.metadata.intent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => entry.metadata.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const allTags = Array.from(new Set(entries.flatMap(e => e.metadata.tags)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dataset Manager</h1>
          <p className="text-muted-foreground">Create and manage your negotiation training data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import JSON/CSV
          </Button>
          <Button onClick={createNewEntry} className="gap-2">
            <Plus className="h-4 w-4" />
            New Entry
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select onValueChange={(tag) => setSelectedTags(prev => 
          prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        )}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by tags" />
          </SelectTrigger>
          <SelectContent>
            {allTags.map(tag => (
              <SelectItem key={tag} value={tag}>{tag}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEntries.map((entry) => (
          <Card key={entry.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{entry.title}</CardTitle>
                  <CardDescription>
                    {entry.messages.length} messages • {entry.metadata.business_type}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(entry.id)}
                  className={entry.is_favorite ? "text-yellow-500" : ""}
                >
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary">{entry.metadata.intent}</Badge>
                <Badge variant={entry.metadata.outcome === "deal_closed" ? "default" : "outline"}>
                  {entry.metadata.outcome}
                </Badge>
                <Badge variant="outline">{entry.metadata.complexity}</Badge>
              </div>
              
              {entry.metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {entry.metadata.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingEntry(entry);
                    setIsCreateDialogOpen(true);
                  }}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteEntry(entry.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EntryDialog
        entry={editingEntry}
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setEditingEntry(null);
        }}
        onSave={saveEntry}
      />
    </div>
  );
}

function EntryDialog({ 
  entry, 
  isOpen, 
  onClose, 
  onSave 
}: {
  entry: ConversationEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: ConversationEntry) => void;
}) {
  const [formData, setFormData] = useState<ConversationEntry | null>(null);

  useEffect(() => {
    if (entry) {
      setFormData({ ...entry });
    }
  }, [entry]);

  if (!formData) return null;

  const addMessage = () => {
    setFormData(prev => prev ? {
      ...prev,
      messages: [
        ...prev.messages,
        {
          role: "user",
          content: "",
          timestamp: new Date().toISOString(),
        }
      ]
    } : null);
  };

  const updateMessage = (index: number, field: keyof typeof formData.messages[0], value: string) => {
    setFormData(prev => prev ? {
      ...prev,
      messages: prev.messages.map((msg, i) => 
        i === index ? { ...msg, [field]: value } : msg
      )
    } : null);
  };

  const removeMessage = (index: number) => {
    setFormData(prev => prev ? {
      ...prev,
      messages: prev.messages.filter((_, i) => i !== index)
    } : null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {formData.id === crypto.randomUUID() ? "Create" : "Edit"} Conversation Entry
          </DialogTitle>
          <DialogDescription>
            Design a complete negotiation conversation with metadata for training.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="conversation" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="conversation">Conversation</TabsTrigger>
            <TabsTrigger value="metadata">Metadata & Tags</TabsTrigger>
          </TabsList>

          <TabsContent value="conversation" className="space-y-4">
            <div>
              <Label htmlFor="title">Conversation Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => prev ? { ...prev, title: e.target.value } : null)}
                placeholder="e.g., Electronics Store Price Negotiation"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Messages</Label>
                <Button onClick={addMessage} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Message
                </Button>
              </div>
              
              {formData.messages.map((message, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Select
                      value={message.role}
                      onValueChange={(role: "user" | "assistant") => updateMessage(index, "role", role)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="assistant">Assistant</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => removeMessage(index)}
                      size="sm"
                      variant="ghost"
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={message.content}
                    onChange={(e) => updateMessage(index, "content", e.target.value)}
                    placeholder={`${message.role === "user" ? "Customer" : "Assistant"} message...`}
                    rows={3}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="intent">Intent</Label>
                <Select
                  value={formData.metadata.intent}
                  onValueChange={(value) => setFormData(prev => prev ? {
                    ...prev,
                    metadata: { ...prev.metadata, intent: value }
                  } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount_request">Discount Request</SelectItem>
                    <SelectItem value="price_inquiry">Price Inquiry</SelectItem>
                    <SelectItem value="bundle_negotiation">Bundle Negotiation</SelectItem>
                    <SelectItem value="warranty_discussion">Warranty Discussion</SelectItem>
                    <SelectItem value="payment_terms">Payment Terms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="outcome">Outcome</Label>
                <Select
                  value={formData.metadata.outcome}
                  onValueChange={(value) => setFormData(prev => prev ? {
                    ...prev,
                    metadata: { ...prev.metadata, outcome: value }
                  } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deal_closed">Deal Closed</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="follow_up">Follow Up</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="business_type">Business Type</Label>
                <Select
                  value={formData.metadata.business_type}
                  onValueChange={(value) => setFormData(prev => prev ? {
                    ...prev,
                    metadata: { ...prev.metadata, business_type: value }
                  } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="b2b">B2B</SelectItem>
                    <SelectItem value="real_estate">Real Estate</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="complexity">Complexity</Label>
                <Select
                  value={formData.metadata.complexity}
                  onValueChange={(value: "low" | "medium" | "high") => setFormData(prev => prev ? {
                    ...prev,
                    metadata: { ...prev.metadata, complexity: value }
                  } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="final_price">Final Price (optional)</Label>
              <Input
                id="final_price"
                type="number"
                value={formData.metadata.final_price || ""}
                onChange={(e) => setFormData(prev => prev ? {
                  ...prev,
                  metadata: { ...prev.metadata, final_price: Number(e.target.value) }
                } : null)}
                placeholder="Enter final negotiated price"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.metadata.tags.join(", ")}
                onChange={(e) => setFormData(prev => prev ? {
                  ...prev,
                  metadata: { 
                    ...prev.metadata, 
                    tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                  }
                } : null)}
                placeholder="aggressive, hesitation, price_sensitive, bulk_buyer"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(formData)}>
            Save Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
