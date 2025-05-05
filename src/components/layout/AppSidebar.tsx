import { Link, useLocation, useNavigate } from "react-router-dom";
import { Clock, Calendar, CalendarDays, ChartBar, MessageCircleQuestion, LogOut } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isMobile,
    setOpenMobile
  } = useSidebar();
  const menuItems = [{
    title: "Cronômetro",
    path: "/dashboard",
    icon: Clock
  }, {
    title: "Relatório Mensal",
    path: "/dashboard/reports",
    icon: ChartBar
  }, {
    title: "Histórico",
    path: "/dashboard/history",
    icon: CalendarDays
  }];
  const handleLogout = async () => {
    try {
      // Use Supabase to sign out
      await supabase.auth.signOut();

      // Clear authentication state
      localStorage.removeItem('isAuthenticated');
      toast.success("Logout realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout. Tente novamente.");
    }
  };
  const handleSupport = () => {
    // Redirect to the Studdy support page
    window.open("https://bio.site/Studdy", "_blank");
  };

  // Função para fechar o menu móvel quando um item do menu é clicado
  const handleMenuItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  return <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-2 bg-transparent">
            <img alt="Studdy Logo" src="/lovable-uploads/1e9fb661-e9f5-4cc6-ab06-404627667bbe.png" className="h-10 w-10 rounded-md" />
            <h1 className="text-gray-800 text-xl font-bold">Studdy</h1>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="pb-12">
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className={cn("flex items-center space-x-3 w-full", location.pathname === item.path ? "text-primary font-medium" : "")} onClick={handleMenuItemClick}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <div className="mt-8 px-4">
          <div className="rounded-xl bg-accent p-4 text-sm">
            <h3 className="font-medium mb-1 text-accent-foreground">Dica do dia</h3>
            <p className="text-muted-foreground">
              Alternar entre matérias diferentes pode ajudar a manter o foco e melhorar a retenção de informação.
            </p>
          </div>
        </div>

        <div className="mt-auto px-4 pt-4 flex flex-col gap-3">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleSupport}>
            <MessageCircleQuestion className="h-4 w-4" />
            <span>Suporte</span>
          </Button>
          
          <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>;
};
export default AppSidebar;