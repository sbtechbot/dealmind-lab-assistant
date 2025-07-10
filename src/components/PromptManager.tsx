
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Copy, Save, RotateCcw, Plus, Trash2, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FewShotExample {
  id: string;
  input: string;
  output: string;
  description: string;
}

interface PromptVersion {
  id: string;
  version: string;
  system_prompt: string;
  few_shot_examples: FewShotExample[];
  parameters: {
    temperature: number;
    top_p: number;
    max_tokens: number;
  };
  created_at: string;
  notes: string;
}

export function PromptManager() {
  const [currentPrompt, setCurrentPrompt] = useState<PromptVersion>({
    id: crypto.randomUUID(),
    version: "1.0",
    system_prompt: `You are DealMind, an expert AI negotiation assistant. Your role is to help businesses close deals while maintaining customer satisfaction.

Guidelines:
- Always be professional and courteous
- Find win-win solutions when possible
- Understand the customer's needs and constraints
- Know when to hold firm and when to compromise
- Build rapport and trust throughout the conversation

Your goal is to maximize value for both parties while securing a successful transaction.`,
    few_shot_examples: [],
    parameters: {
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 1000,
    },
    created_at: new Date().toISOString(),
    notes: "",
  });

  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [newExample, setNewExample] = useState<Partial<FewShotExample>>({
    input: "",
    output: "",
    description: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedVersions = JSON.parse(localStorage.getItem("dealMindPromptVersions") || "[]");
    if (savedVersions.length > 0) {
      setVersions(savedVersions);
      setCurrentPrompt(savedVersions[savedVersions.length - 1]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dealMindPromptVersions", JSON.stringify(versions));
  }, [versions]);

  const saveVersion = () => {
    const newVersion = {
      ...currentPrompt,
      id: crypto.randomUUID(),
      version: `${parseFloat(currentPrompt.version) + 0.1}`.slice(0, 3),
      created_at: new Date().toISOString(),
    };
    
    setVersions(prev => [...prev, newVersion]);
    setCurrentPrompt(newVersion);
    
    toast({
      title: "Version saved",
      description: `Prompt version ${newVersion.version} has been saved.`,
    });
  };

  const loadVersion = (version: PromptVersion) => {
    setCurrentPrompt(version);
    toast({
      title: "Version loaded",
      description: `Loaded prompt version ${version.version}`,
    });
  };

  const addFewShotExample = () => {
    if (!newExample.input || !newExample.output) {
      toast({
        title: "Incomplete example",
        description: "Please provide both input and output for the example.",
        variant: "destructive",
      });
      return;
    }

    const example: FewShotExample = {
      id: crypto.randomUUID(),
      input: newExample.input!,
      output: newExample.output!,
      description: newExample.description || "",
    };

    setCurrentPrompt(prev => ({
      ...prev,
      few_shot_examples: [...prev.few_shot_examples, example],
    }));

    setNewExample({ input: "", output: "", description: "" });
    
    toast({
      title: "Example added",
      description: "Few-shot example has been added successfully.",
    });
  };

  const removeFewShotExample = (id: string) => {
    setCurrentPrompt(prev => ({
      ...prev,
      few_shot_examples: prev.few_shot_examples.filter(ex => ex.id !== id),
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard.",
    });
  };

  const resetToDefault = () => {
    setCurrentPrompt({
      id: crypto.randomUUID(),
      version: "1.0",
      system_prompt: `You are DealMind, an expert AI negotiation assistant. Your role is to help businesses close deals while maintaining customer satisfaction.

Guidelines:
- Always be professional and courteous
- Find win-win solutions when possible
- Understand the customer's needs and constraints
- Know when to hold firm and when to compromise
- Build rapport and trust throughout the conversation

Your goal is to maximize value for both parties while securing a successful transaction.`,
      few_shot_examples: [],
      parameters: {
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1000,
      },
      created_at: new Date().toISOString(),
      notes: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prompt Manager</h1>
          <p className="text-muted-foreground">Configure system prompts and few-shot examples</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefault} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={saveVersion} className="gap-2">
            <Save className="h-4 w-4" />
            Save Version
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="outline" className="text-sm">
          Version {currentPrompt.version}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {currentPrompt.few_shot_examples.length} examples
        </span>
        <span className="text-sm text-muted-foreground">
          Last updated: {new Date(currentPrompt.created_at).toLocaleDateString()}
        </span>
      </div>

      <Tabs defaultValue="system" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="system">System Prompt</TabsTrigger>
          <TabsTrigger value="examples">Few-Shot Examples</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="versions">Version History</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                System Prompt
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(currentPrompt.system_prompt)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Base instructions that define DealMind's behavior and personality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={currentPrompt.system_prompt}
                onChange={(e) => setCurrentPrompt(prev => ({ ...prev, system_prompt: e.target.value }))}
                rows={15}
                className="font-mono text-sm"
                placeholder="Enter your system prompt..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>
                Add notes about this prompt version for future reference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={currentPrompt.notes}
                onChange={(e) => setCurrentPrompt(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
                placeholder="Version notes, changes made, performance observations..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Example</CardTitle>
              <CardDescription>
                Create input/output pairs to guide the model's behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  value={newExample.description}
                  onChange={(e) => setNewExample(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., Handling aggressive price objections"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="input">Input (Customer Message)</Label>
                  <Textarea
                    id="input"
                    value={newExample.input}
                    onChange={(e) => setNewExample(prev => ({ ...prev, input: e.target.value }))}
                    rows={4}
                    placeholder="Your price is way too high! I can get this elsewhere for half the price."
                  />
                </div>
                
                <div>
                  <Label htmlFor="output">Output (Expected Response)</Label>
                  <Textarea
                    id="output"
                    value={newExample.output}
                    onChange={(e) => setNewExample(prev => ({ ...prev, output: e.target.value }))}
                    rows={4}
                    placeholder="I understand price is important to you. Let me explain the value you're getting and see if we can find a solution that works for both of us."
                  />
                </div>
              </div>

              <Button onClick={addFewShotExample} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Example
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {currentPrompt.few_shot_examples.map((example, index) => (
              <Card key={example.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    Example {index + 1}
                    {example.description && (
                      <Badge variant="secondary">{example.description}</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFewShotExample(example.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-green-600">Input</Label>
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm">{example.input}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-blue-600">Output</Label>
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm">{example.output}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Parameters</CardTitle>
              <CardDescription>
                Fine-tune how the model generates responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Temperature</Label>
                  <span className="text-sm text-muted-foreground">
                    {currentPrompt.parameters.temperature}
                  </span>
                </div>
                <Slider
                  value={[currentPrompt.parameters.temperature]}
                  onValueChange={(value) => setCurrentPrompt(prev => ({
                    ...prev,
                    parameters: { ...prev.parameters, temperature: value[0] }
                  }))}
                  max={2}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Controls randomness: 0 = focused, 2 = creative
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Top P</Label>
                  <span className="text-sm text-muted-foreground">
                    {currentPrompt.parameters.top_p}
                  </span>
                </div>
                <Slider
                  value={[currentPrompt.parameters.top_p]}
                  onValueChange={(value) => setCurrentPrompt(prev => ({
                    ...prev,
                    parameters: { ...prev.parameters, top_p: value[0] }
                  }))}
                  max={1}
                  min={0}
                  step={0.05}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Controls diversity of word choice
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Max Tokens</Label>
                  <span className="text-sm text-muted-foreground">
                    {currentPrompt.parameters.max_tokens}
                  </span>
                </div>
                <Slider
                  value={[currentPrompt.parameters.max_tokens]}
                  onValueChange={(value) => setCurrentPrompt(prev => ({
                    ...prev,
                    parameters: { ...prev.parameters, max_tokens: value[0] }
                  }))}
                  max={4000}
                  min={100}
                  step={100}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum length of generated response
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Version History
              </CardTitle>
              <CardDescription>
                Track and manage different prompt versions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {versions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No saved versions yet</p>
                  <p className="text-sm">Save your first prompt version to start tracking changes</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {versions.map((version) => (
                    <div
                      key={version.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        version.id === currentPrompt.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant={version.id === currentPrompt.id ? "default" : "outline"}>
                              v{version.version}
                            </Badge>
                            <span className="font-medium">
                              {version.id === currentPrompt.id ? "(Current)" : ""}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(version.created_at).toLocaleString()} • 
                            {version.few_shot_examples.length} examples
                          </p>
                          {version.notes && (
                            <p className="text-sm mt-2">{version.notes}</p>
                          )}
                        </div>
                        {version.id !== currentPrompt.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => loadVersion(version)}
                          >
                            Load
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
