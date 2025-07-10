import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Save, RotateCcw, Zap, Tag, MessageSquare, Sparkles, Clock } from "lucide-react";
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
    <div className="space-y-8 bg-white">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border-2 border-primary">
        <div>
          <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
            <MessageSquare className="h-10 w-10" />
            Conversation Simulator
          </h1>
          <p className="text-lg text-muted-foreground mt-2">Live negotiation simulation with AI models</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={resetSession} className="gap-2 h-12 px-6 text-base border-2 border-primary hover:bg-primary hover:text-white">
            <RotateCcw className="h-5 w-5" />
            Reset
          </Button>
          <Button onClick={saveSession} className="gap-2 h-12 px-6 text-base bg-primary hover:bg-primary/90">
            <Save className="h-5 w-5" />
            Save Session
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Configuration Panel */}
        <Card className="lg:col-span-1 border-2 border-primary">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-xl text-primary flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Simulation Setup
            </CardTitle>
            <CardDescription className="text-base">Configure your negotiation scenario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div>
              <Label htmlFor="title" className="text-base font-semibold">Session Title</Label>
              <Input
                id="title"
                value={currentSession.title}
                onChange={(e) => setCurrentSession(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Electronics negotiation..."
                className="mt-2 h-12 text-base border-2 border-primary/30 focus:border-primary"
              />
            </div>

            <div>
              <Label htmlFor="scenario" className="text-base font-semibold">Scenario Context</Label>
              <Textarea
                id="scenario"
                value={currentSession.scenario}
                onChange={(e) => setCurrentSession(prev => ({ ...prev, scenario: e.target.value }))}
                placeholder="Customer wants to buy a laptop but finds the price too high..."
                rows={4}
                className="mt-2 text-base border-2 border-primary/30 focus:border-primary"
              />
            </div>

            <div>
              <Label className="text-base font-semibold">Intent</Label>
              <Select
                value={currentSession.metadata.intent}
                onValueChange={(value) => setCurrentSession(prev => ({
                  ...prev,
                  metadata: { ...prev.metadata, intent: value }
                }))}
              >
                <SelectTrigger className="mt-2 h-12 text-base border-2 border-primary/30">
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
              <Label className="text-base font-semibold">Business Type</Label>
              <Select
                value={currentSession.metadata.business_type}
                onValueChange={(value) => setCurrentSession(prev => ({
                  ...prev,
                  metadata: { ...prev.metadata, business_type: value }
                }))}
              >
                <SelectTrigger className="mt-2 h-12 text-base border-2 border-primary/30">
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

            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <Label className="text-base font-semibold">Mode:</Label>
                <Badge variant={isManualMode ? "default" : "secondary"} className="text-sm px-3 py-1">
                  {isManualMode ? "Manual" : "AI Auto"}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsManualMode(!isManualMode)}
                disabled={!isManualMode}
                className="border-primary hover:bg-primary hover:text-white"
              >
                <Zap className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-3 border-2 border-primary">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center gap-3 text-xl text-primary">
              <MessageSquare className="h-6 w-6" />
              Live Simulation
            </CardTitle>
            <CardDescription className="text-base">
              {currentSession.messages.length} messages • {currentSession.metadata.business_type}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Chat Messages */}
              <ScrollArea className="h-96 border-2 border-primary/20 rounded-xl p-6 bg-white">
                <div className="space-y-6">
                  {currentSession.messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                      <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Start your negotiation simulation...</p>
                    </div>
                  ) : (
                    currentSession.messages.map((message) => (
                      <div key={message.id} className="flex gap-4">
                        <Avatar className="h-10 w-10 border-2 border-primary">
                          <AvatarFallback className={message.role === "user" ? "bg-primary/10" : "bg-primary text-white"}>
                            {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-base">
                              {message.role === "user" ? "Customer" : "Assistant"}
                            </span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedMessageId(
                                selectedMessageId === message.id ? null : message.id
                              )}
                              className="h-8 w-8 p-0 hover:bg-primary/10"
                            >
                              <Tag className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="bg-muted/50 rounded-xl p-4 border border-primary/10">
                            <p className="text-base leading-relaxed">{message.content}</p>
                          </div>
                          {message.tags && message.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {message.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs cursor-pointer border-primary hover:bg-primary hover:text-white"
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
                                className="text-sm h-10 border-primary/30"
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
                                className="bg-primary hover:bg-primary/90"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-base font-semibold">
                    <User className="h-5 w-5" />
                    Customer Message
                  </Label>
                  <div className="flex gap-3">
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="I'm interested but the price seems high..."
                      rows={4}
                      className="text-base border-2 border-primary/30 focus:border-primary"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendUserMessage();
                        }
                      }}
                    />
                    <Button onClick={sendUserMessage} className="self-end h-12 w-12 bg-primary hover:bg-primary/90">
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-base font-semibold">
                    <Bot className="h-5 w-5" />
                    Assistant Response {!isManualMode && "(AI Generated)"}
                  </Label>
                  <div className="flex gap-3">
                    <Textarea
                      value={botInput}
                      onChange={(e) => setBotInput(e.target.value)}
                      placeholder="I understand your concern. Let me see what I can do..."
                      rows={4}
                      disabled={!isManualMode}
                      className="text-base border-2 border-primary/30 focus:border-primary disabled:opacity-50"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendBotMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={sendBotMessage} 
                      className="self-end h-12 w-12 bg-primary hover:bg-primary/90" 
                      disabled={!isManualMode}
                    >
                      <Send className="h-5 w-5" />
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
