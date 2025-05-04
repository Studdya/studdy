
import SessionsTable from "@/components/history/SessionsTable";
import { useStudy } from "@/context/StudyContext";
import { Skeleton } from "@/components/ui/skeleton";

const HistoryPage = () => {
  const { loading } = useStudy();

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
      </div>
      
      <SessionsTable />
    </div>
  );
};

export default HistoryPage;
