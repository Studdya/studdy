
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, CalendarDays } from "lucide-react";
import { useStudy } from "@/context/StudyContext";

const StudySummaryCards = ({ month, year }: { month: number; year: number }) => {
  const { getSessionsByMonth, getStudyDays } = useStudy();
  
  // Calculate total hours
  const totalSeconds = getSessionsByMonth(month, year).reduce(
    (total, session) => total + session.duration, 0
  );
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  // Get study days count
  const studyDays = getStudyDays(month, year);
  
  // Get session count
  const sessionCount = getSessionsByMonth(month, year).length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="glass-card border-purple-100/30 hover:border-purple-300/30 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold tracking-tight text-muted-foreground">
            Tempo Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Clock className="text-purple-500 mr-2" />
            <div>
              <p className="text-2xl font-bold">
                {hours}h {minutes}min
              </p>
              <p className="text-xs text-muted-foreground">neste mês</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card border-blue-100/30 hover:border-blue-300/30 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold tracking-tight text-muted-foreground">
            Dias de Estudo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Calendar className="text-blue-500 mr-2" />
            <div>
              <p className="text-2xl font-bold">{studyDays} dias</p>
              <p className="text-xs text-muted-foreground">neste mês</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card border-purple-100/30 hover:border-purple-300/30 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold tracking-tight text-muted-foreground">
            Sessões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <CalendarDays className="text-purple-500 mr-2" />
            <div>
              <p className="text-2xl font-bold">{sessionCount}</p>
              <p className="text-xs text-muted-foreground">sessões registradas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudySummaryCards;
