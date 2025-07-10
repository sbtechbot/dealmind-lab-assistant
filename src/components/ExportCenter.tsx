
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileJson, FileSpreadsheet, Filter, Eye } from "lucide-react";
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

export function ExportCenter() {
  const [entries, setEntries] = useState<ConversationEntry[]>([]);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [filterIntent, setFilterIntent] = useState<string>("all");
  const [filterOutcome, setFilterOutcome] = useState<string>("all");
  const [filterComplexity, setFilterComplexity] = useState<string>("all");
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [exportFormat, setExportFormat] = useState<"jsonl" | "csv">("jsonl");
  const { toast } = useToast();

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem("dealMindEntries") || "[]");
    setEntries(savedEntries);
    setSelectedEntries(savedEntries.map((e: ConversationEntry) => e.id));
  }, []);

  const filteredEntries = entries.filter(entry => {
    const intentMatch = filterIntent === "all" || entry.metadata.intent === filterIntent;
    const outcomeMatch = filterOutcome === "all" || entry.metadata.outcome === filterOutcome;
    const complexityMatch = filterComplexity === "all" || entry.metadata.complexity === filterComplexity;
    return intentMatch && outcomeMatch && complexityMatch;
  });

  const selectedFilteredEntries = filteredEntries.filter(entry => 
    selectedEntries.includes(entry.id)
  );

  const toggleEntrySelection = (entryId: string) => {
    setSelectedEntries(prev => 
      prev.includes(entryId) 
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId]
    );
  };

  const selectAll = () => {
    setSelectedEntries(filteredEntries.map(e => e.id));
  };

  const selectNone = () => {
    setSelectedEntries([]);
  };

  const exportToJsonl = () => {
    const exportData = selectedFilteredEntries.map(entry => {
      const systemPrompt = "You are DealMind, an expert AI negotiation assistant helping businesses close deals while maintaining customer satisfaction.";
      
      const messages = [
        { role: "system", content: systemPrompt },
        ...entry.messages
      ];

      const baseData = { messages };
      
      if (includeMetadata) {
        return {
          ...baseData,
          metadata: entry.metadata,
          id: entry.id,
          title: entry.title,
          created_at: entry.created_at
        };
      }
      
      return baseData;
    });

    const jsonlContent = exportData.map(item => JSON.stringify(item)).join('\n');
    downloadFile(jsonlContent, `dealMind_training_${new Date().toISOString().split('T')[0]}.jsonl`, 'application/jsonl');
  };

  const exportToCsv = () => {
    const headers = [
      'id', 'title', 'user_message', 'assistant_response', 'intent', 'outcome', 
      'business_type', 'complexity', 'final_price', 'tags', 'created_at'
    ];

    const rows = selectedFilteredEntries.flatMap(entry => {
      const conversationPairs = [];
      for (let i = 0; i < entry.messages.length - 1; i += 2) {
        if (entry.messages[i] && entry.messages[i + 1]) {
          conversationPairs.push({
            id: entry.id,
            title: entry.title,
            user_message: entry.messages[i].content,
            assistant_response: entry.messages[i + 1].content,
            intent: entry.metadata.intent,
            outcome: entry.metadata.outcome,
            business_type: entry.metadata.business_type,
            complexity: entry.metadata.complexity,
            final_price: entry.metadata.final_price || '',
            tags: entry.metadata.tags.join(';'),
            created_at: entry.created_at
          });
        }
      }
      return conversationPairs;
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => headers.map(header => {
        const value = row[header as keyof typeof row];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(','))
    ].join('\n');

    downloadFile(csvContent, `dealMind_dataset_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: `Downloaded ${filename} with ${selectedFilteredEntries.length} conversations.`,
    });
  };

  const previewData = () => {
    if (selectedFilteredEntries.length === 0) {
      toast({
        title: "No data selected",
        description: "Please select at least one conversation to preview.",
        variant: "destructive",
      });
      return;
    }

    const sample = selectedFilteredEntries[0];
    const preview = exportFormat === "jsonl" 
      ? JSON.stringify({
          messages: [
            { role: "system", content: "You are DealMind..." },
            ...sample.messages.slice(0, 2)
          ],
          ...(includeMetadata && { metadata: sample.metadata })
        }, null, 2)
      : `id,title,user_message,assistant_response,intent,outcome\n${sample.id},"${sample.title}","${sample.messages[0]?.content}","${sample.messages[1]?.content}","${sample.metadata.intent}","${sample.metadata.outcome}"`;

    navigator.clipboard.writeText(preview);
    toast({
      title: "Preview copied",
      description: "Sample export data copied to clipboard.",
    });
  };

  const uniqueIntents = Array.from(new Set(entries.map(e => e.metadata.intent)));
  const uniqueOutcomes = Array.from(new Set(entries.map(e => e.metadata.outcome)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Export Center</h1>
          <p className="text-muted-foreground">Generate training datasets from your conversations</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {selectedFilteredEntries.length} selected
          </Badge>
          <Badge variant="outline">
            {filteredEntries.length} total
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="selection" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="selection">Data Selection</TabsTrigger>
          <TabsTrigger value="format">Export Format</TabsTrigger>
          <TabsTrigger value="preview">Preview & Export</TabsTrigger>
        </TabsList>

        <TabsContent value="selection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Conversations
              </CardTitle>
              <CardDescription>
                Filter and select conversations for your training dataset
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Intent</Label>
                  <Select value={filterIntent} onValueChange={setFilterIntent}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Intents</SelectItem>
                      {uniqueIntents.map(intent => (
                        <SelectItem key={intent} value={intent}>{intent}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Outcome</Label>
                  <Select value={filterOutcome} onValueChange={setFilterOutcome}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Outcomes</SelectItem>
                      {uniqueOutcomes.map(outcome => (
                        <SelectItem key={outcome} value={outcome}>{outcome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Complexity</Label>
                  <Select value={filterComplexity} onValueChange={setFilterComplexity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={selectAll} size="sm">
                  Select All ({filteredEntries.length})
                </Button>
                <Button variant="outline" onClick={selectNone} size="sm">
                  Select None
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEntries.map((entry) => (
              <Card key={entry.id} className={`cursor-pointer transition-colors ${
                selectedEntries.includes(entry.id) ? "border-primary bg-primary/5" : ""
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Checkbox
                          checked={selectedEntries.includes(entry.id)}
                          onCheckedChange={() => toggleEntrySelection(entry.id)}
                        />
                        {entry.title}
                      </CardTitle>
                      <CardDescription>
                        {entry.messages.length} messages • {entry.metadata.business_type}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="secondary">{entry.metadata.intent}</Badge>
                    <Badge variant={entry.metadata.outcome === "deal_closed" ? "default" : "outline"}>
                      {entry.metadata.outcome}
                    </Badge>
                    <Badge variant="outline">{entry.metadata.complexity}</Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(entry.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="format" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Format Settings</CardTitle>
              <CardDescription>
                Configure how your data will be exported
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Export Format</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Card className={`cursor-pointer transition-colors ${
                    exportFormat === "jsonl" ? "border-primary bg-primary/5" : ""
                  }`} onClick={() => setExportFormat("jsonl")}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileJson className="h-5 w-5" />
                        <span className="font-medium">JSONL</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        For OpenAI fine-tuning and most ML frameworks
                      </p>
                      <div className="mt-2">
                        <Badge variant="secondary">Recommended</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`cursor-pointer transition-colors ${
                    exportFormat === "csv" ? "border-primary bg-primary/5" : ""
                  }`} onClick={() => setExportFormat("csv")}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileSpreadsheet className="h-5 w-5" />
                        <span className="font-medium">CSV</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        For analysis, visualization, and spreadsheet tools
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="metadata"
                  checked={includeMetadata}
                  onCheckedChange={(checked) => setIncludeMetadata(checked as boolean)}
                />
                <Label htmlFor="metadata">Include metadata (intent, outcome, tags, etc.)</Label>
              </div>

              <div className="border rounded-lg p-4 bg-muted/20">
                <h4 className="font-medium mb-2">Export Details</h4>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>• System prompt will be automatically included in JSONL format</p>
                  <p>• CSV format creates one row per user-assistant message pair</p>
                  <p>• All timestamps and IDs are preserved for traceability</p>
                  {includeMetadata && <p>• Metadata fields will be included for analysis</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Export Summary
              </CardTitle>
              <CardDescription>
                Review your export configuration and download
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {selectedFilteredEntries.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Conversations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {selectedFilteredEntries.reduce((acc, entry) => acc + entry.messages.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Messages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {exportFormat.toUpperCase()}
                  </div>
                  <div className="text-sm text-muted-foreground">Format</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {includeMetadata ? "Yes" : "No"}
                  </div>
                  <div className="text-sm text-muted-foreground">Metadata</div>
                </div>
              </div>

              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={previewData} className="gap-2">
                  <Eye className="h-4 w-4" />
                  Preview Sample
                </Button>
                <Button 
                  onClick={exportFormat === "jsonl" ? exportToJsonl : exportToCsv}
                  className="gap-2"
                  disabled={selectedFilteredEntries.length === 0}
                >
                  <Download className="h-4 w-4" />
                  Export {exportFormat.toUpperCase()}
                </Button>
              </div>

              {selectedFilteredEntries.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No conversations selected for export</p>
                  <p className="text-sm">Go back to the selection tab to choose conversations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
