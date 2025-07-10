
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DatasetManager } from "@/components/DatasetManager";
import { ConversationSimulator } from "@/components/ConversationSimulator";
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
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
