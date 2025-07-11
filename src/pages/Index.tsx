
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
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <header className="bg-background/80 backdrop-blur-sm border-b border-border px-4 py-4 shadow-sm flex-shrink-0">
            <div className="max-w-full">
              <div className="animate-fade-in">
                <h1 className="text-xl font-bold text-foreground mb-1 truncate">{getViewTitle()}</h1>
                <p className="text-muted-foreground text-sm truncate">{getViewDescription()}</p>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 p-4 overflow-auto">
            <div className="max-w-full animate-slide-up">
              <div className="bg-card rounded-lg shadow-sm border border-border p-4 min-h-[calc(100vh-8rem)] max-w-full overflow-hidden">
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
