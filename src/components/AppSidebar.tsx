
import { Database, MessageSquare, FileText, Download, Bot, Brain } from "lucide-react";
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
  { id: "prompts", title: "Prompt Manager", icon: FileText, description: "System prompts & few-shot examples" },
  { id: "export", title: "Export Center", icon: Download, description: "Generate training datasets" },
  { id: "models", title: "Model Integration", icon: Bot, description: "Connect AI models" },
];

export function AppSidebar({ activeView, onViewChange }: AppSidebarProps) {
  const { collapsed } = useSidebar();

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible>
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg">DealMind Lab</h1>
              <p className="text-sm text-muted-foreground">AI Negotiation Training</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.id)}
                    className={activeView === item.id ? "bg-primary/10 text-primary" : ""}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && (
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{item.title}</span>
                        <span className="text-xs text-muted-foreground">{item.description}</span>
                      </div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <div className="p-2">
        <SidebarTrigger />
      </div>
    </Sidebar>
  );
}
