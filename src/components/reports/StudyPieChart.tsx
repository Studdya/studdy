
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudy } from "@/context/StudyContext";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const StudyPieChart = ({ month, year }: { month: number; year: number }) => {
  const { subjects, getSessionsByMonth, getTotalDurationBySubject } = useStudy();
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${hours}h ${minutes}min`;
  };
  
  const data: ChartData[] = subjects
    .map(subject => {
      const totalDuration = getSessionsByMonth(month, year)
        .filter(session => session.subject.id === subject.id)
        .reduce((total, session) => total + session.duration, 0);
      
      return {
        name: subject.name,
        value: totalDuration / 3600, // Convert to hours for better chart display
        color: subject.color,
        actualDuration: totalDuration // Keep the actual duration for display
      };
    })
    .filter(item => item.value > 0); // Only show subjects with study time
    
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tempo por Matéria</CardTitle>
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
        <CardTitle>Tempo por Matéria</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string, props: any) => {
                // Use the actual duration stored for proper formatting
                return [formatTime(props.payload.actualDuration), name];
              }} 
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StudyPieChart;
