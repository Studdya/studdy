
import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

// Componente de botão flutuante para abrir a barra lateral quando ela estiver fechada
const SidebarToggleButton = () => {
  const { state, openMobile, setOpenMobile, isMobile } = useSidebar();
  
  // Em desktop, mostra o botão apenas quando a sidebar está completamente fechada
  if (!isMobile && state !== "collapsed") return null;

  // Em dispositivos móveis, sempre mostra o botão quando a sidebar não está aberta
  if (isMobile && !openMobile) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed top-2 left-2 z-50 bg-background/80 backdrop-blur-sm shadow-md md:hidden"
        onClick={() => setOpenMobile(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>
    );
  }

  // Em desktop, mostra o botão de retorno quando a sidebar está recolhida
  if (!isMobile && state === "collapsed") {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm shadow-md hidden md:flex"
        onClick={() => setOpenMobile(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
    );
  }
  
  return null;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-2 sm:p-3 md:p-6 overflow-auto animate-fade-in">
          <SidebarToggleButton />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
