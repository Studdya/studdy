
import SessionsTable from "@/components/history/SessionsTable";
import { useStudy } from "@/context/StudyContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import AddSessionDialog from "@/components/history/AddSessionDialog";

const HistoryPage = () => {
  const { loading } = useStudy();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
        </div>
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Histórico de Sessões</h1>
        <Button 
          className="gradient-purple-blue"
          onClick={() => setIsDialogOpen(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" /> 
          Adicionar sessão manual
        </Button>
      </div>
      
      <SessionsTable />
      
      <AddSessionDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </div>
  );
};

export default HistoryPage;
