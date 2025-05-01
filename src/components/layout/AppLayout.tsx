
import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

// Componente de botão flutuante para abrir a barra lateral quando ela estiver fechada
const SidebarToggleButton = () => {
  const { state, toggleSidebar } = useSidebar();
  
  if (state !== "collapsed") return null;
  
  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm shadow-md"
      onClick={toggleSidebar}
    >
      <PanelLeft className="h-5 w-5" />
    </Button>
  );
};

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-auto animate-fade-in">
          <SidebarToggleButton />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
