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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Star, Upload, Tag, Save, Eye, FileJson, FileSpreadsheet, TableProperties } from "lucide-react";
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

interface TableHeader {
  id: string;
  name: string;
  type: "text" | "number" | "select";
  options?: string[];
}

interface TableEntry {
  id: string;
  data: Record<string, any>;
}

export function DatasetManager() {
  const [entries, setEntries] = useState<ConversationEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ConversationEntry | null>(null);
  
  // New state for table-based data entry
  const [isTableEntryMode, setIsTableEntryMode] = useState(false);
  const [tableHeaders, setTableHeaders] = useState<TableHeader[]>([]);
  const [tableEntries, setTableEntries] = useState<TableEntry[]>([]);
  const [isDefiningHeaders, setIsDefiningHeaders] = useState(false);
  
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

  const startTableEntry = () => {
    setIsDefiningHeaders(true);
    setTableHeaders([
      { id: "intent", name: "Intent", type: "text" },
      { id: "message", name: "Message", type: "text" },
      { id: "industry", name: "Industry", type: "select", options: ["Retail", "B2B", "Real Estate", "Automotive", "Services"] },
      { id: "expected_response", name: "Expected Response", type: "text" },
    ]);
  };

  const addTableHeader = () => {
    const newHeader: TableHeader = {
      id: crypto.randomUUID(),
      name: "",
      type: "text",
    };
    setTableHeaders(prev => [...prev, newHeader]);
  };

  const updateTableHeader = (id: string, field: keyof TableHeader, value: any) => {
    setTableHeaders(prev => prev.map(header => 
      header.id === id ? { ...header, [field]: value } : header
    ));
  };

  const removeTableHeader = (id: string) => {
    setTableHeaders(prev => prev.filter(header => header.id !== id));
  };

  const startDataEntry = () => {
    if (tableHeaders.length === 0) {
      toast({
        title: "No headers defined",
        description: "Please define at least one table header before starting data entry.",
        variant: "destructive",
      });
      return;
    }
    setIsDefiningHeaders(false);
    setIsTableEntryMode(true);
    // Initialize with one empty row
    setTableEntries([{ id: crypto.randomUUID(), data: {} }]);
  };

  const addTableRow = () => {
    setTableEntries(prev => [...prev, { id: crypto.randomUUID(), data: {} }]);
  };

  const updateTableEntry = (entryId: string, field: string, value: any) => {
    setTableEntries(prev => prev.map(entry => 
      entry.id === entryId 
        ? { ...entry, data: { ...entry.data, [field]: value } }
        : entry
    ));
  };

  const removeTableRow = (entryId: string) => {
    setTableEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const saveTableData = () => {
    const validEntries = tableEntries.filter(entry => 
      Object.values(entry.data).some(value => value && value.toString().trim())
    );
    
    if (validEntries.length === 0) {
      toast({
        title: "No data to save",
        description: "Please enter some data before saving.",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage or your preferred storage
    localStorage.setItem("tableData", JSON.stringify({
      headers: tableHeaders,
      entries: validEntries,
      createdAt: new Date().toISOString(),
    }));

    toast({
      title: "Data saved successfully",
      description: `${validEntries.length} entries have been saved to your dataset.`,
    });

    // Reset the table entry mode
    setIsTableEntryMode(false);
    setIsDefiningHeaders(false);
    setTableHeaders([]);
    setTableEntries([]);
  };

  const viewAllData = () => {
    // This would show all created datasets
    toast({
      title: "Data Center",
      description: "Opening data center view...",
    });
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
          <h1 className="text-3xl font-bold text-primary">Dataset Manager</h1>
          <p className="text-muted-foreground">Create and manage your negotiation training data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-red-200 hover:bg-red-50">
            <Upload className="h-4 w-4" />
            Import JSON/CSV
          </Button>
          <Button onClick={viewAllData} variant="outline" className="gap-2 border-red-200 hover:bg-red-50">
            <Eye className="h-4 w-4" />
            Data Center
          </Button>
          <Button onClick={createNewEntry} variant="outline" className="gap-2 border-red-200 hover:bg-red-50">
            <Plus className="h-4 w-4" />
            New Entry
          </Button>
          <Button onClick={startTableEntry} className="gap-2 bg-primary hover:bg-red-600">
            <TableProperties className="h-4 w-4" />
            Table Entry
          </Button>
        </div>
      </div>

      <Tabs defaultValue="entries" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-red-50">
          <TabsTrigger value="entries" className="data-[state=active]:bg-primary data-[state=active]:text-white">Conversation Entries</TabsTrigger>
          <TabsTrigger value="table" className="data-[state=active]:bg-primary data-[state=active]:text-white">Table Data Entry</TabsTrigger>
          <TabsTrigger value="data-center" className="data-[state=active]:bg-primary data-[state=active]:text-white">Data Center</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-4">
          
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-red-200 focus:border-primary"
              />
            </div>
            <Select onValueChange={(tag) => setSelectedTags(prev => 
              prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
            )}>
              <SelectTrigger className="w-48 border-red-200 focus:border-primary">
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
              <Card key={entry.id} className="hover:shadow-md transition-shadow border-red-100">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-primary">{entry.title}</CardTitle>
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
                      className="flex-1 border-red-200 hover:bg-red-50"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteEntry(entry.id)}
                      className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          {isDefiningHeaders ? (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-primary">Define Table Headers</CardTitle>
                <CardDescription>Set up the columns for your data entry table</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tableHeaders.map((header) => (
                  <div key={header.id} className="flex gap-4 items-end p-4 border border-red-100 rounded-lg">
                    <div className="flex-1">
                      <Label>Header Name</Label>
                      <Input
                        value={header.name}
                        onChange={(e) => updateTableHeader(header.id, "name", e.target.value)}
                        placeholder="e.g., Intent, Message, Industry"
                      />
                    </div>
                    <div className="w-32">
                      <Label>Type</Label>
                      <Select value={header.type} onValueChange={(value: "text" | "number" | "select") => updateTableHeader(header.id, "type", value)}>
                        <SelectTrigger className="border-red-200 focus:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {header.type === "select" && (
                      <div className="flex-1">
                        <Label>Options (comma-separated)</Label>
                        <Input
                          value={header.options?.join(", ") || ""}
                          onChange={(e) => updateTableHeader(header.id, "options", e.target.value.split(",").map(s => s.trim()))}
                          placeholder="Option 1, Option 2, Option 3"
                        />
                      </div>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeTableHeader(header.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <div className="flex gap-2">
                  <Button onClick={addTableHeader} variant="outline" className="border-red-200 hover:bg-red-50">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Header
                  </Button>
                  <Button onClick={startDataEntry} className="bg-primary hover:bg-red-600">
                    Start Data Entry
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : isTableEntryMode ? (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-primary">Data Entry Table</CardTitle>
                <CardDescription>Enter your data according to the defined headers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {tableHeaders.map(header => (
                          <TableHead key={header.id} className="text-primary font-semibold">
                            {header.name}
                          </TableHead>
                        ))}
                        <TableHead className="w-20"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableEntries.map(entry => (
                        <TableRow key={entry.id}>
                          {tableHeaders.map(header => (
                            <TableCell key={header.id}>
                              {header.type === "select" ? (
                                <Select 
                                  value={entry.data[header.id] || ""} 
                                  onValueChange={(value) => updateTableEntry(entry.id, header.id, value)}
                                >
                                  <SelectTrigger className="border-red-200 focus:border-primary">
                                    <SelectValue placeholder="Select..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {header.options?.map(option => (
                                      <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  type={header.type}
                                  value={entry.data[header.id] || ""}
                                  onChange={(e) => updateTableEntry(entry.id, header.id, e.target.value)}
                                  className="border-red-200 focus:border-primary"
                                />
                              )}
                            </TableCell>
                          ))}
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTableRow(entry.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button onClick={addTableRow} variant="outline" className="border-red-200 hover:bg-red-50">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Row
                  </Button>
                  <Button onClick={saveTableData} className="bg-primary hover:bg-red-600">
                    <Save className="h-4 w-4 mr-1" />
                    Save Data
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsTableEntryMode(false);
                      setIsDefiningHeaders(false);
                    }} 
                    variant="outline"
                    className="border-red-200 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-red-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TableProperties className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">Table Data Entry</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create structured datasets by defining table headers and entering data row by row
                </p>
                <Button onClick={startTableEntry} className="bg-primary hover:bg-red-600">
                  Start New Table Entry
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="data-center" className="space-y-4">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-primary">Data Center</CardTitle>
              <CardDescription>View and manage all your created datasets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 border-red-100">
                  <div className="flex items-center gap-3 mb-3">
                    <FileJson className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-semibold">Conversation Entries</h4>
                      <p className="text-sm text-muted-foreground">JSON Format</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-red-200 hover:bg-red-50">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-200 hover:bg-red-50">
                      <Upload className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </Card>
                
                <Card className="p-4 border-red-100">
                  <div className="flex items-center gap-3 mb-3">
                    <FileSpreadsheet className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-semibold">Table Data</h4>
                      <p className="text-sm text-muted-foreground">CSV Format</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-red-200 hover:bg-red-50">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-200 hover:bg-red-50">
                      <Upload className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
