
import SessionsTable from "@/components/history/SessionsTable";

const HistoryPage = () => {
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
