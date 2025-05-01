
import { Link, useLocation } from "react-router-dom";
import { Clock, Calendar, CalendarDays, ChartBar } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const AppSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Cronômetro",
      path: "/",
      icon: Clock,
    },
    {
      title: "Relatório Mensal",
      path: "/reports",
      icon: ChartBar,
    },
    {
      title: "Histórico",
      path: "/history",
      icon: CalendarDays,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-1.5">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Estudos</h1>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="pb-12">
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path} 
                      className={cn(
                        "flex items-center space-x-3 w-full", 
                        location.pathname === item.path ? "text-primary font-medium" : ""
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <div className="mt-12 px-4">
          <div className="rounded-xl bg-accent p-4 text-sm">
            <h3 className="font-medium mb-1 text-accent-foreground">Dica do dia</h3>
            <p className="text-muted-foreground">
              Alternar entre matérias diferentes pode ajudar a manter o foco e melhorar a retenção de informação.
            </p>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
