
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
      <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-bold text-xl text-primary">DealMind Lab</h1>
              <p className="text-sm text-muted-foreground">AI Negotiation Training</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupLabel className="text-base font-semibold text-primary px-6 py-4 uppercase tracking-wide">
            Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-4">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.id)}
                    className={`${
                      activeView === item.id 
                        ? "bg-primary text-primary-foreground shadow-lg border-l-4 border-primary scale-105" 
                        : "hover:bg-primary/10 hover:border-l-4 hover:border-primary/30 hover:scale-102"
                    } p-4 rounded-lg transition-all duration-200 ease-out min-h-[4rem] group card-hover`}
                  >
                    <div className={`p-2 rounded-md ${
                      activeView === item.id 
                        ? "bg-primary-foreground/20" 
                        : "bg-primary/10 group-hover:bg-primary/20"
                    } transition-colors duration-200`}>
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                    </div>
                    {!collapsed && (
                      <div className="flex flex-col items-start ml-3 flex-1">
                        <span className="text-sm font-semibold leading-tight">{item.title}</span>
                        <span className="text-xs opacity-80 mt-1 leading-tight">{item.description}</span>
                      </div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <div className="p-4 border-t border-border bg-gradient-to-r from-primary/5 to-primary/10">
        <SidebarTrigger className="w-full p-3 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 font-medium shadow-sm hover:shadow-md" />
      </div>
    </Sidebar>
  );
}
