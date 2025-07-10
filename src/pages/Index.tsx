
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DatasetManager } from "@/components/DatasetManager";
import { ConversationSimulator } from "@/components/ConversationSimulator";
import { ModelTraining } from "@/components/ModelTraining";
import { PromptManager } from "@/components/PromptManager";
import { ExportCenter } from "@/components/ExportCenter";
import { ModelIntegration } from "@/components/ModelIntegration";
import { useState } from "react";

const Index = () => {
  const [activeView, setActiveView] = useState("dataset");

  const getViewTitle = () => {
    const titles = {
      dataset: "Dataset Manager",
      simulator: "Chat Simulator", 
      training: "Model Training",
      prompts: "Prompt Manager",
      export: "Export Center",
      models: "Model Integration"
    };
    return titles[activeView as keyof typeof titles] || "Dataset Manager";
  };

  const getViewDescription = () => {
    const descriptions = {
      dataset: "Create and manage training datasets for AI negotiations",
      simulator: "Practice live negotiation scenarios with AI",
      training: "Train and fine-tune AI models on your data",
      prompts: "Manage system prompts and few-shot examples",
      export: "Generate and export training datasets",
      models: "Connect and configure AI model integrations"
    };
    return descriptions[activeView as keyof typeof descriptions] || "";
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "dataset":
        return <DatasetManager />;
      case "simulator":
        return <ConversationSimulator />;
      case "training":
        return <ModelTraining />;
      case "prompts":
        return <PromptManager />;
      case "export":
        return <ExportCenter />;
      case "models":
        return <ModelIntegration />;
      default:
        return <DatasetManager />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-primary/5">
        <AppSidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-background/80 backdrop-blur-sm border-b border-border p-6 shadow-sm">
            <div className="max-w-7xl mx-auto">
              <div className="animate-fade-in">
                <h1 className="text-2xl font-bold text-foreground mb-2">{getViewTitle()}</h1>
                <p className="text-muted-foreground text-sm">{getViewDescription()}</p>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto animate-slide-up">
              <div className="bg-card rounded-xl shadow-sm border border-border p-6 min-h-[calc(100vh-12rem)]">
                {renderActiveView()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
