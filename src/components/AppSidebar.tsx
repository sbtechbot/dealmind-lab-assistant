
import { Database, MessageSquare, FileText, Download, Bot, Brain, Cpu } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: "dataset", title: "Dataset Manager", icon: Database, description: "Create & manage training data" },
  { id: "simulator", title: "Chat Simulator", icon: MessageSquare, description: "Live negotiation simulation" },
  { id: "training", title: "Model Training", icon: Cpu, description: "Train AI models" },
  { id: "prompts", title: "Prompt Manager", icon: FileText, description: "System prompts & few-shot examples" },
  { id: "export", title: "Export Center", icon: Download, description: "Generate training datasets" },
  { id: "models", title: "Model Integration", icon: Bot, description: "Connect AI models" },
];

export function AppSidebar({ activeView, onViewChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className={collapsed ? "w-16" : "w-80"} collapsible="icon">
      <div className="p-6 border-b-2 border-primary bg-white">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          {!collapsed && (
            <div>
              <h1 className="font-bold text-xl text-primary">DealMind Lab</h1>
              <p className="text-base text-muted-foreground">AI Negotiation Training</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold text-primary px-6 py-4">Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 px-4">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.id)}
                    className={`${
                      activeView === item.id 
                        ? "bg-primary text-white border-l-4 border-primary shadow-lg" 
                        : "hover:bg-primary/10 hover:border-l-4 hover:border-primary/50"
                    } p-4 rounded-lg transition-all duration-200 min-h-[4rem]`}
                  >
                    <item.icon className="h-6 w-6 flex-shrink-0" />
                    {!collapsed && (
                      <div className="flex flex-col items-start ml-3 flex-1">
                        <span className="text-base font-semibold">{item.title}</span>
                        <span className="text-sm opacity-80">{item.description}</span>
                      </div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <div className="p-4 border-t-2 border-primary bg-white">
        <SidebarTrigger className="w-full p-3 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors" />
      </div>
    </Sidebar>
  );
}
