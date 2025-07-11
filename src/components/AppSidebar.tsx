
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
    <Sidebar className={collapsed ? "w-16" : "w-72"} collapsible="icon">
      <div className={`p-4 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10 ${collapsed ? "px-2" : "px-4"}`}>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in min-w-0">
              <h1 className="font-bold text-lg text-primary truncate">DealMind Lab</h1>
              <p className="text-xs text-muted-foreground truncate">AI Negotiation Training</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupLabel className={`text-sm font-semibold text-primary uppercase tracking-wide ${collapsed ? "px-2 py-3" : "px-4 py-3"}`}>
            {collapsed ? "T" : "Tools"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className={`space-y-1 ${collapsed ? "px-1" : "px-3"}`}>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.id)}
                    className={`${
                      activeView === item.id 
                        ? "bg-primary text-primary-foreground shadow-md border-l-4 border-primary" 
                        : "hover:bg-primary/10 hover:border-l-4 hover:border-primary/30"
                    } ${collapsed ? "p-2 justify-center min-h-[3rem]" : "p-3 min-h-[3.5rem]"} rounded-lg transition-all duration-200 ease-out group card-hover`}
                    title={collapsed ? item.title : undefined}
                  >
                    <div className={`p-1.5 rounded-md ${
                      activeView === item.id 
                        ? "bg-primary-foreground/20" 
                        : "bg-primary/10 group-hover:bg-primary/20"
                    } transition-colors duration-200 flex-shrink-0`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    {!collapsed && (
                      <div className="flex flex-col items-start ml-2 flex-1 min-w-0">
                        <span className="text-sm font-semibold leading-tight truncate w-full">{item.title}</span>
                        <span className="text-xs opacity-80 mt-0.5 leading-tight truncate w-full">{item.description}</span>
                      </div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <div className={`border-t border-border bg-gradient-to-r from-primary/5 to-primary/10 ${collapsed ? "p-2" : "p-3"}`}>
        <SidebarTrigger className={`w-full rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 font-medium shadow-sm hover:shadow-md ${collapsed ? "p-2 h-10" : "p-2.5 h-12"}`} />
      </div>
    </Sidebar>
  );
}
