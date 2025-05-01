
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudy } from "@/context/StudyContext";
import { StudySession } from "@/types/study";
import AddSessionDialog from "./AddSessionDialog";

const SessionsTable = () => {
  const { sessions, subjects, deleteSession } = useStudy();
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter sessions based on selected subject and period
  const filteredSessions = sessions.filter(session => {
    const subjectMatch = selectedSubject === "all" || session.subject.id === selectedSubject;
    
    const sessionDate = new Date(session.date);
    const today = new Date();
    
    let periodMatch = true;
    
    if (selectedPeriod === "week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      periodMatch = sessionDate >= oneWeekAgo;
    } else if (selectedPeriod === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1);
      periodMatch = sessionDate >= oneMonthAgo;
    }
    
    return subjectMatch && periodMatch;
  });
  
  // Sort by date (most recent first)
  const sortedSessions = [...filteredSessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes} minutos`;
  };
  
  // Format content type
  const formatContentType = (type: string) => {
    const types: Record<string, string> = {
      'video': 'Vídeo',
      'leitura': 'Leitura',
      'exercício': 'Exercício',
      'revisão': 'Revisão',
      'outro': 'Outro'
    };
    
    return types[type] || type;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por matéria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as matérias</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  <div className="flex items-center">
                    <span 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: subject.color }}
                    ></span>
                    {subject.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mês</SelectItem>
              <SelectItem value="all">Todos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          className="gradient-purple-blue"
          onClick={() => setIsDialogOpen(true)}
        >
          Adicionar sessão manual
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Histórico de sessões</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedSessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground">Data</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground">Matéria</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground">Tipo</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground">Duração</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSessions.map((session) => (
                    <tr key={session.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="py-3 px-4">{formatDate(session.date)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: session.subject.color }}
                          ></span>
                          {session.subject.name}
                        </div>
                      </td>
                      <td className="py-3 px-4">{formatContentType(session.contentType)}</td>
                      <td className="py-3 px-4">{formatDuration(session.duration)}</td>
                      <td className="py-3 px-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteSession(session.id)}
                        >
                          Remover
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              Nenhuma sessão encontrada com os filtros atuais
            </div>
          )}
        </CardContent>
      </Card>
      
      <AddSessionDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </div>
  );
};

export default SessionsTable;
