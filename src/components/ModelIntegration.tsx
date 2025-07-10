
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Zap, Settings, TestTube, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ModelConfig {
  provider: "openai" | "openrouter" | "huggingface" | "local";
  apiKey: string;
  model: string;
  baseUrl?: string;
  isEnabled: boolean;
}

export function ModelIntegration() {
  const [modelConfigs, setModelConfigs] = useState<Record<string, ModelConfig>>({
    openai: {
      provider: "openai",
      apiKey: "",
      model: "gpt-4",
      isEnabled: false,
    },
    openrouter: {
      provider: "openrouter",
      apiKey: "",
      model: "anthropic/claude-3-sonnet",
      baseUrl: "https://openrouter.ai/api/v1",
      isEnabled: false,
    },
    huggingface: {
      provider: "huggingface",
      apiKey: "",
      model: "microsoft/DialoGPT-medium",
      isEnabled: false,
    },
    local: {
      provider: "local",
      apiKey: "",
      model: "llama-7b",
      baseUrl: "http://localhost:8080",
      isEnabled: false,
    },
  });

  const [testMessage, setTestMessage] = useState("I'm interested in your product, but the price seems a bit high.");
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; response?: string; error?: string; latency?: number }>>({});
  const [isTestingAll, setIsTestingAll] = useState(false);
  const { toast } = useToast();

  const updateModelConfig = (provider: string, updates: Partial<ModelConfig>) => {
    setModelConfigs(prev => ({
      ...prev,
      [provider]: { ...prev[provider], ...updates }
    }));
  };

  const testModel = async (provider: string) => {
    const config = modelConfigs[provider];
    if (!config.isEnabled || !config.apiKey) {
      toast({
        title: "Model not configured",
        description: `Please configure ${provider} before testing.`,
        variant: "destructive",
      });
      return;
    }

    const startTime = Date.now();
    
    try {
      // This is a mock implementation - in a real app, you'd make actual API calls
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
      
      const mockResponses = {
        openai: "I understand your concern about the price. Let me explain the value you're getting and see if we can find a solution that works for both of us.",
        openrouter: "Price is definitely important. I'd be happy to discuss the features and benefits to help you see the value. What specific budget range were you considering?",
        huggingface: "I hear you on the pricing. Let me share some details about what makes this worth the investment and see what options we have.",
        local: "Thanks for your interest! I appreciate your feedback on pricing. Let me walk you through the value proposition and explore some possibilities."
      };

      const latency = Date.now() - startTime;
      const response = mockResponses[provider as keyof typeof mockResponses];

      setTestResults(prev => ({
        ...prev,
        [provider]: {
          success: true,
          response,
          latency
        }
      }));

      toast({
        title: "Test successful",
        description: `${provider} responded in ${latency}ms`,
      });

    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [provider]: {
          success: false,
          error: "Connection failed"
        }
      }));

      toast({
        title: "Test failed",
        description: `Failed to connect to ${provider}`,
        variant: "destructive",
      });
    }
  };

  const testAllModels = async () => {
    setIsTestingAll(true);
    const enabledProviders = Object.keys(modelConfigs).filter(
      provider => modelConfigs[provider].isEnabled && modelConfigs[provider].apiKey
    );

    for (const provider of enabledProviders) {
      await testModel(provider);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
    }
    
    setIsTestingAll(false);
  };

  const saveConfigurations = () => {
    localStorage.setItem("dealMindModelConfigs", JSON.stringify(modelConfigs));
    toast({
      title: "Configurations saved",
      description: "Model configurations have been saved locally.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Model Integration</h1>
          <p className="text-muted-foreground">Connect and test AI models for automated responses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={testAllModels} disabled={isTestingAll} className="gap-2">
            <TestTube className="h-4 w-4" />
            {isTestingAll ? "Testing..." : "Test All"}
          </Button>
          <Button onClick={saveConfigurations} className="gap-2">
            <Settings className="h-4 w-4" />
            Save Config
          </Button>
        </div>
      </div>

      <Tabs defaultValue="providers" className="w-full">
        <TabsList>
          <TabsTrigger value="providers">Model Providers</TabsTrigger>
          <TabsTrigger value="testing">Testing & Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(modelConfigs).map(([provider, config]) => (
              <Card key={provider}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      {provider.charAt(0).toUpperCase() + provider.slice(1)}
                    </div>
                    <Switch
                      checked={config.isEnabled}
                      onCheckedChange={(enabled) => updateModelConfig(provider, { isEnabled: enabled })}
                    />
                  </CardTitle>
                  <CardDescription>
                    {provider === "openai" && "OpenAI GPT models for high-quality responses"}
                    {provider === "openrouter" && "Access to multiple models via OpenRouter"}
                    {provider === "huggingface" && "Open-source models from Hugging Face"}
                    {provider === "local" &&  "Local models running on your machine"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`${provider}-api-key`}>
                      {provider === "local" ? "Endpoint URL" : "API Key"}
                    </Label>
                    <Input
                      id={`${provider}-api-key`}
                      type={provider === "local" ? "url" : "password"}
                      value={config.apiKey}
                      onChange={(e) => updateModelConfig(provider, { apiKey: e.target.value })}
                      placeholder={
                        provider === "local" 
                          ? "http://localhost:8080" 
                          : "Enter your API key..."
                      }
                      disabled={!config.isEnabled}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`${provider}-model`}>Model</Label>
                    <Select
                      value={config.model}
                      onValueChange={(model) => updateModelConfig(provider, { model })}
                      disabled={!config.isEnabled}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {provider === "openai" && (
                          <>
                            <SelectItem value="gpt-4">GPT-4</SelectItem>
                            <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                          </>
                        )}
                        {provider === "openrouter" && (
                          <>
                            <SelectItem value="anthropic/claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                            <SelectItem value="meta-llama/llama-3-70b-instruct">Llama 3 70B</SelectItem>
                            <SelectItem value="mistralai/mixtral-8x7b-instruct">Mixtral 8x7B</SelectItem>
                          </>
                        )}
                        {provider === "huggingface" && (
                          <>
                            <SelectItem value="microsoft/DialoGPT-medium">DialoGPT Medium</SelectItem>
                            <SelectItem value="facebook/blenderbot-400M-distill">BlenderBot 400M</SelectItem>
                            <SelectItem value="microsoft/DialoGPT-large">DialoGPT Large</SelectItem>
                          </>
                        )}
                        {provider === "local" && (
                          <>
                            <SelectItem value="llama-7b">Llama 7B</SelectItem>
                            <SelectItem value="mistral-7b">Mistral 7B</SelectItem>
                            <SelectItem value="codellama-7b">CodeLlama 7B</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {config.baseUrl && (
                    <div>
                      <Label htmlFor={`${provider}-base-url`}>Base URL</Label>
                      <Input
                        id={`${provider}-base-url`}
                        value={config.baseUrl}
                        onChange={(e) => updateModelConfig(provider, { baseUrl: e.target.value })}
                        disabled={!config.isEnabled}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      {testResults[provider] && (
                        testResults[provider].success ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Failed
                          </Badge>
                        )
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testModel(provider)}
                      disabled={!config.isEnabled || !config.apiKey}
                    >
                      <Zap className="h-4 w-4 mr-1" />
                      Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Testing</CardTitle>
              <CardDescription>
                Test your configured models with sample negotiation scenarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="test-message">Test Message</Label>
                <Textarea
                  id="test-message"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  rows={3}
                  placeholder="Enter a customer message to test with..."
                />
              </div>

              <div className="space-y-4">
                {Object.entries(testResults).map(([provider, result]) => (
                  <Card key={provider} className={result.success ? "border-green-200" : "border-red-200"}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-2">
                          {result.success ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          )}
                          {provider.charAt(0).toUpperCase() + provider.slice(1)}
                        </div>
                        {result.latency && (
                          <Badge variant="outline">{result.latency}ms</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {result.success ? (
                        <div className="space-y-2">
                          <Label className="text-sm text-green-600">Response</Label>
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm">{result.response}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label className="text-sm text-red-600">Error</Label>
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm">{result.error}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {Object.keys(testResults).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <TestTube className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No test results yet</p>
                  <p className="text-sm">Configure and test your models to see responses here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
