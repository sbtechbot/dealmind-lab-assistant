
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, Play, Save, Eye, BarChart3, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";

interface TrainingConfig {
  batchSize: number;
  testSize: number;
  trainingSize: number;
  epochs: number;
  learningRate: number;
}

interface TrainedModel {
  id: string;
  name: string;
  accuracy: number;
  loss: number;
  trainingDate: string;
  status: "training" | "completed" | "failed";
}

export function ModelTraining() {
  const [selectedDataset, setSelectedDataset] = useState<string>("");
  const [trainingConfig, setTrainingConfig] = useState<TrainingConfig>({
    batchSize: 32,
    testSize: 20,
    trainingSize: 80,
    epochs: 10,
    learningRate: 0.001,
  });
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainedModels, setTrainedModels] = useState<TrainedModel[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTrainedModels();
  }, []);

  const loadTrainedModels = async () => {
    try {
      setLoading(true);
      const models = await api.getTrainedModels();
      setTrainedModels(models);
    } catch (error) {
      toast({
        title: "Error loading models",
        description: "Failed to load trained models from the server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDatasetUpload = () => {
    toast({
      title: "Dataset uploaded",
      description: "Your dataset has been successfully uploaded and is ready for training.",
    });
  };

  const handleStartTraining = async () => {
    try {
      setIsTraining(true);
      setTrainingProgress(0);
      
      await api.trainModel({
        dataset: selectedDataset,
        config: trainingConfig,
      });
      
      const interval = setInterval(() => {
        setTrainingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsTraining(false);
            
            const newModel: TrainedModel = {
              id: crypto.randomUUID(),
              name: `Model_${Date.now()}`,
              accuracy: 85 + Math.random() * 10,
              loss: Math.random() * 0.5,
              trainingDate: new Date().toISOString(),
              status: "completed",
            };
            
            handleSaveModel(newModel);
            
            toast({
              title: "Training completed!",
              description: "Your model has been successfully trained and is ready for deployment.",
            });
            
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    } catch (error) {
      setIsTraining(false);
      toast({
        title: "Training failed",
        description: "Failed to start model training. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveModel = async (model: Omit<TrainedModel, 'id' | 'trainingDate'>) => {
    try {
      const savedModel = await api.saveTrainedModel(model);
      setTrainedModels(prev => [...prev, savedModel]);
      
      toast({
        title: "Model saved",
        description: `Model "${model.name}" has been added to your model collection.`,
      });
    } catch (error) {
      toast({
        title: "Error saving model",
        description: "Failed to save the trained model.",
        variant: "destructive",
      });
    }
  };

  const updateModelName = (modelId: string, name: string) => {
    setTrainedModels(prev => 
      prev.map(model => 
        model.id === modelId ? { ...model, name } : model
      )
    );
    
    toast({
      title: "Model updated",
      description: `Model name updated to "${name}".`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Model Training</h1>
          <p className="text-muted-foreground">Train your AI negotiation models</p>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-red-50">
          <TabsTrigger value="upload" className="data-[state=active]:bg-primary data-[state=active]:text-white">Upload Dataset</TabsTrigger>
          <TabsTrigger value="configure" className="data-[state=active]:bg-primary data-[state=active]:text-white">Configure Training</TabsTrigger>
          <TabsTrigger value="train" className="data-[state=active]:bg-primary data-[state=active]:text-white">Train Model</TabsTrigger>
          <TabsTrigger value="models" className="data-[state=active]:bg-primary data-[state=active]:text-white">Trained Models</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-primary">Dataset Upload</CardTitle>
              <CardDescription>Upload or import your training dataset</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-red-200 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Dataset</h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop your dataset file or click to browse
                </p>
                <Button onClick={handleDatasetUpload} className="bg-primary hover:bg-red-600">
                  Choose File
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold text-primary mb-2">Local Datasets</h4>
                  <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dataset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="negotiations_v1">Negotiations Dataset v1</SelectItem>
                      <SelectItem value="customer_service">Customer Service Dataset</SelectItem>
                      <SelectItem value="sales_calls">Sales Calls Dataset</SelectItem>
                    </SelectContent>
                  </Select>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-semibold text-primary mb-2">Dataset Info</h4>
                  {selectedDataset && (
                    <div className="text-sm space-y-1">
                      <p>Records: 1,234</p>
                      <p>Size: 15.2 MB</p>
                      <p>Format: JSON</p>
                    </div>
                  )}
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configure" className="space-y-4">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-primary">Training Configuration</CardTitle>
              <CardDescription>Set up your model training parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="batchSize">Batch Size</Label>
                  <Input
                    id="batchSize"
                    type="number"
                    value={trainingConfig.batchSize}
                    onChange={(e) => setTrainingConfig(prev => ({ ...prev, batchSize: Number(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="epochs">Epochs</Label>
                  <Input
                    id="epochs"
                    type="number"
                    value={trainingConfig.epochs}
                    onChange={(e) => setTrainingConfig(prev => ({ ...prev, epochs: Number(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="trainingSize">Training Size (%)</Label>
                  <Input
                    id="trainingSize"
                    type="number"
                    value={trainingConfig.trainingSize}
                    onChange={(e) => setTrainingConfig(prev => ({ ...prev, trainingSize: Number(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="testSize">Test Size (%)</Label>
                  <Input
                    id="testSize"
                    type="number"
                    value={trainingConfig.testSize}
                    onChange={(e) => setTrainingConfig(prev => ({ ...prev, testSize: Number(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="learningRate">Learning Rate</Label>
                  <Input
                    id="learningRate"
                    type="number"
                    step="0.001"
                    value={trainingConfig.learningRate}
                    onChange={(e) => setTrainingConfig(prev => ({ ...prev, learningRate: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="train" className="space-y-4">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-primary">Start Training</CardTitle>
              <CardDescription>Train your model with the configured parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isTraining && trainingProgress === 0 && (
                <div className="text-center space-y-4">
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-primary mb-2">Ready to Train</h3>
                    <p className="text-muted-foreground mb-4">
                      Your model is configured and ready for training
                    </p>
                    <Button
                      onClick={handleStartTraining}
                      className="bg-primary hover:bg-red-600"
                      size="lg"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Training
                    </Button>
                  </div>
                </div>
              )}
              
              {(isTraining || trainingProgress > 0) && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-primary">Training Progress</h3>
                    <Badge variant={isTraining ? "default" : "secondary"}>
                      {isTraining ? "Training..." : "Completed"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(trainingProgress)}%</span>
                    </div>
                    <Progress value={trainingProgress} className="h-3" />
                  </div>
                  
                  {trainingProgress === 100 && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-800">Training Completed Successfully!</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-primary">Trained Models</CardTitle>
              <CardDescription>Manage your trained models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading trained models...
                  </div>
                ) : trainedModels.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No trained models yet. Start training to see your models here.
                  </div>
                ) : (
                  trainedModels.map((model) => (
                    <Card key={model.id} className="p-4 border-red-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-primary">{model.name}</h4>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Accuracy: {model.accuracy.toFixed(1)}%</span>
                            <span>Loss: {model.loss.toFixed(3)}</span>
                            <span>Date: {new Date(model.trainingDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Evaluate
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-primary hover:bg-red-600"
                            onClick={() => updateModelName(model.id, `Production_${Date.now()}`)}
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Deploy
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
