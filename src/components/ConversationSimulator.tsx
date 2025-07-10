import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarContent, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Save, RotateCcw, Zap, Tag, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  tags?: string[];
}

interface SimulationSession {
  id: string;
  title: string;
  messages: Message[];
  scenario: string;
  created_at: string;
  metadata: {
    intent: string;
    business_type: string;
    complexity: "low" | "medium" | "high";
  };
}

export function ConversationSimulator() {
  const [currentSession, setCurrentSession] = useState<SimulationSession>({
    id: crypto.randomUUID(),
    title: "New Simulation",
    messages: [],
    scenario: "",
    created_at: new Date().toISOString(),
    metadata: {
      intent: "discount_request",
      business_type: "retail",
      complexity: "medium",
    },
  });
  
  const [userInput, setUserInput] = useState("");
  const [botInput, setBotInput] = useState("");
  const [isManualMode, setIsManualMode] = useState(true);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [messageTag, setMessageTag] = useState("");
  const { toast } = useToast();

  const addMessage = (role: "user" | "assistant", content: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date().toISOString(),
      tags: [],
    };

    setCurrentSession(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
  };

  const sendUserMessage = () => {
    if (!userInput.trim()) return;
    
    addMessage("user", userInput);
    setUserInput("");
    
    // Auto-generate bot response hint
    if (isManualMode) {
      setBotInput("I understand. Let me see what I can do for you...");
    }
  };

  const sendBotMessage = () => {
    if (!botInput.trim()) return;
    
    addMessage("assistant", botInput);
    setBotInput("");
  };

  const saveSession = () => {
    const savedSessions = JSON.parse(localStorage.getItem("dealMindSessions") || "[]");
    const updatedSessions = savedSessions.filter((s: SimulationSession) => s.id !== currentSession.id);
    updatedSessions.push(currentSession);
    localStorage.setItem("dealMindSessions", JSON.stringify(updatedSessions));
    
    toast({
      title: "Session saved",
      description: "Your conversation simulation has been saved.",
    });
  };

  const resetSession = () => {
    setCurrentSession({
      id: crypto.randomUUID(),
      title: "New Simulation",
      messages: [],
      scenario: "",
      created_at: new Date().toISOString(),
      metadata: {
        intent: "discount_request",
        business_type: "retail",
        complexity: "medium",
      },
    });
    setUserInput("");
    setBotInput("");
    setSelectedMessageId(null);
  };

  const addTagToMessage = (messageId: string, tag: string) => {
    setCurrentSession(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.id === messageId 
          ? { ...msg, tags: [...(msg.tags || []), tag] }
          : msg
      ),
    }));
    setMessageTag("");
  };

  const removeTagFromMessage = (messageId: string, tagToRemove: string) => {
    setCurrentSession(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.id === messageId 
          ? { ...msg, tags: (msg.tags || []).filter(tag => tag !== tagToRemove) }
          : msg
      ),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Conversation Simulator</h1>
          <p className="text-muted-foreground">Live negotiation simulation with AI models</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetSession} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={saveSession} className="gap-2">
            <Save className="h-4 w-4" />
            Save Session
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Configuration Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Simulation Setup</CardTitle>
            <CardDescription>Configure your negotiation scenario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Session Title</Label>
              <Input
                id="title"
                value={currentSession.title}
                onChange={(e) => setCurrentSession(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Electronics negotiation..."
              />
            </div>

            <div>
              <Label htmlFor="scenario">Scenario Context</Label>
              <Textarea
                id="scenario"
                value={currentSession.scenario}
                onChange={(e) => setCurrentSession(prev => ({ ...prev, scenario: e.target.value }))}
                placeholder="Customer wants to buy a laptop but finds the price too high..."
                rows={3}
              />
            </div>

            <div>
              <Label>Intent</Label>
              <Select
                value={currentSession.metadata.intent}
                onValueChange={(value) => setCurrentSession(prev => ({
                  ...prev,
                  metadata: { ...prev.metadata, intent: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount_request">Discount Request</SelectItem>
                  <SelectItem value="price_inquiry">Price Inquiry</SelectItem>
                  <SelectItem value="bundle_negotiation">Bundle Negotiation</SelectItem>
                  <SelectItem value="warranty_discussion">Warranty Discussion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Business Type</Label>
              <Select
                value={currentSession.metadata.business_type}
                onValueChange={(value) => setCurrentSession(prev => ({
                  ...prev,
                  metadata: { ...prev.metadata, business_type: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="b2b">B2B</SelectItem>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label>Mode:</Label>
              <Badge variant={isManualMode ? "default" : "secondary"}>
                {isManualMode ? "Manual" : "AI Auto"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsManualMode(!isManualMode)}
                disabled={!isManualMode}
              >
                <Zap className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Live Simulation
            </CardTitle>
            <CardDescription>
              {currentSession.messages.length} messages • {currentSession.metadata.business_type}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Chat Messages */}
              <ScrollArea className="h-96 border rounded-lg p-4">
                <div className="space-y-4">
                  {currentSession.messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Start your negotiation simulation...</p>
                    </div>
                  ) : (
                    currentSession.messages.map((message) => (
                      <div key={message.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {message.role === "user" ? "Customer" : "Assistant"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedMessageId(
                                selectedMessageId === message.id ? null : message.id
                              )}
                            >
                              <Tag className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="bg-muted rounded-lg p-3">
                            <p className="text-sm">{message.content}</p>
                          </div>
                          {message.tags && message.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {message.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs cursor-pointer"
                                  onClick={() => removeTagFromMessage(message.id, tag)}
                                >
                                  {tag} ×
                                </Badge>
                              ))}
                            </div>
                          )}
                          {selectedMessageId === message.id && (
                            <div className="flex gap-2 items-center">
                              <Input
                                placeholder="Add tag..."
                                value={messageTag}
                                onChange={(e) => setMessageTag(e.target.value)}
                                className="text-xs h-8"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter" && messageTag.trim()) {
                                    addTagToMessage(message.id, messageTag.trim());
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                onClick={() => {
                                  if (messageTag.trim()) {
                                    addTagToMessage(message.id, messageTag.trim());
                                  }
                                }}
                              >
                                Add
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              {/* Input Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Customer Message
                  </Label>
                  <div className="flex gap-2">
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="I'm interested but the price seems high..."
                      rows={3}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendUserMessage();
                        }
                      }}
                    />
                    <Button onClick={sendUserMessage} className="self-end">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    Assistant Response {!isManualMode && "(AI Generated)"}
                  </Label>
                  <div className="flex gap-2">
                    <Textarea
                      value={botInput}
                      onChange={(e) => setBotInput(e.target.value)}
                      placeholder="I understand your concern. Let me see what I can do..."
                      rows={3}
                      disabled={!isManualMode}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendBotMessage();
                        }
                      }}
                    />
                    <Button onClick={sendBotMessage} className="self-end" disabled={!isManualMode}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
