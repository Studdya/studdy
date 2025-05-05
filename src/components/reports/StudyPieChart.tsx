
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudy } from "@/context/StudyContext";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { BookOpen } from "lucide-react";

interface ChartData {
  name: string;
  value: number;
  color: string;
  actualDuration: number;
}

const StudyPieChart = ({ month, year }: { month: number; year: number }) => {
  const { subjects, getSessionsByMonth } = useStudy();
  
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
    .filter(item => item.value > 0) // Only show subjects with study time
    .sort((a, b) => b.value - a.value); // Sort by value in descending order
    
  const totalTime = data.reduce((sum, item) => sum + item.actualDuration, 0);
  const totalHours = Math.floor(totalTime / 3600);
  const totalMinutes = Math.floor((totalTime % 3600) / 60);
  
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            Tempo por Matéria
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Nenhum registro para este mês</p>
        </CardContent>
      </Card>
    );
  }
  
  // Create a configuration for the chart
  const chartConfig = data.reduce(
    (acc, item) => ({
      ...acc,
      [item.name]: {
        label: item.name,
        color: item.color,
      },
    }),
    {}
  );
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          Tempo por Matéria
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {`Total: ${totalHours}h ${totalMinutes}min`}
        </p>
      </CardHeader>
      <CardContent className="h-[300px] pt-4">
        <ChartContainer config={chartConfig} className="h-full">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              labelLine={false}
              label={({ name, percent }) => 
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="transparent"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <div 
                        className="mb-1 flex items-center gap-1.5"
                        style={{ color: data.color }}
                      >
                        <div 
                          className="h-2 w-2 rounded-full" 
                          style={{ backgroundColor: data.color }}
                        />
                        <span className="font-medium">{data.name}</span>
                      </div>
                      <p className="text-sm">
                        {formatTime(data.actualDuration)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {`${(data.value / data.value * 100).toFixed(1)}% do total`}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              layout="vertical"
              verticalAlign="middle" 
              align="right"
              iconType="circle"
              iconSize={8}
              formatter={(value, entry, index) => {
                const { payload } = entry as any;
                return (
                  <span className="text-xs">
                    {value}: {formatTime(payload.actualDuration)}
                  </span>
                );
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default StudyPieChart;
