
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
          <CardTitle className="text-3xl font-bold tracking-tight flex items-center gap-2">
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
  
  // Calculate percentages for each item for internal labels
  data.forEach(item => {
    item['percent'] = (item.actualDuration / totalTime) * 100;
  });
  
  // Custom label renderer that shows percentage inside pie slices
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = props;
    const RADIAN = Math.PI / 180;
    
    // Calculate label position
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Only show label for slices that are large enough to fit text
    if (percent < 0.05) return null;
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#ffffff" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
        stroke="#00000040"
        strokeWidth={0.5}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-muted-foreground" />
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
              label={renderCustomizedLabel}
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
                        {`${data.percent.toFixed(1)}% do total`}
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
              wrapperStyle={{
                paddingLeft: '10px',
                maxHeight: '260px',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default StudyPieChart;
