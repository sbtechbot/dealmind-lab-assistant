
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
      <div className="min-h-screen flex w-full bg-white">
        <AppSidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 p-8 bg-white">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
