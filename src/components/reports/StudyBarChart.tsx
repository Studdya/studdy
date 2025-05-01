
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudy } from "@/context/StudyContext";

const StudyBarChart = ({ month, year }: { month: number; year: number }) => {
  const { getSessionsByMonth } = useStudy();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Create data for each day in the month
  const data = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayStr = day.toString();
    
    // Get all sessions for this day
    const dayDate = new Date(year, month, day);
    const nextDay = new Date(year, month, day + 1);
    
    const sessionsOnDay = getSessionsByMonth(month, year).filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= dayDate && sessionDate < nextDay;
    });
    
    // Calculate total hours
    const totalSeconds = sessionsOnDay.reduce((acc, session) => acc + session.duration, 0);
    const totalHours = totalSeconds / 3600;
    
    return {
      day: dayStr,
      hours: totalHours
    };
  });
  
  // Format time for tooltip
  const formatTime = (hours: number) => {
    const totalMinutes = Math.round(hours * 60);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${mins}min`;
    }
    return `${mins}min`;
  };
  
  // Check if there's any data to display
  const hasData = data.some(d => d.hours > 0);
  
  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Horas de Estudo por Dia</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Nenhum registro para este mês</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Horas de Estudo por Dia</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="day" 
              tickLine={false}
              axisLine={false}
              // Only show every 5th day to avoid crowding
              tick={({ x, y, payload }) => {
                const val = Number(payload.value);
                if (val % 5 === 0 || val === 1 || val === daysInMonth) {
                  return (
                    <text x={x} y={y + 10} fill="#666" fontSize={12} textAnchor="middle">
                      {payload.value}
                    </text>
                  );
                }
                return null;
              }}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false}
              tickFormatter={value => `${value}h`}
            />
            <Tooltip
              formatter={(value: number) => [formatTime(value), "Tempo"]}
              labelFormatter={label => `Dia ${label}`}
            />
            <Bar 
              dataKey="hours" 
              radius={[4, 4, 0, 0]} 
              fill="url(#colorGradient)"
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.9} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StudyBarChart;
