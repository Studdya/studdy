
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StudyTimer from "@/components/timer/StudyTimer";
import { useStudy } from "@/context/StudyContext";
import { Skeleton } from "@/components/ui/skeleton";

const TimerPage = () => {
  const { loading } = useStudy();

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 sm:h-10 w-48 sm:w-64" />
        </div>
        <div className="grid gap-4 sm:gap-6">
          <Skeleton className="h-[350px] sm:h-[400px] w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Skeleton className="h-[180px] sm:h-[220px] w-full rounded-xl" />
            <Skeleton className="h-[180px] sm:h-[220px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Cronômetro de Estudo</h1>
      </div>
      
      <div className="grid gap-4 sm:gap-6">
        <StudyTimer />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="py-4 sm:py-6">
              <CardTitle className="text-lg sm:text-xl">Dicas para estudo eficiente</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-600 rounded-full p-1 mr-2 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                  </span>
                  <span>Divida o tempo em blocos de 25-30 minutos com pequenas pausas</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-600 rounded-full p-1 mr-2 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                  </span>
                  <span>Alterne entre diferentes matérias para manter o interesse</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-600 rounded-full p-1 mr-2 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                  </span>
                  <span>Revise o conteúdo regularmente para melhor fixação</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-600 rounded-full p-1 mr-2 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                  </span>
                  <span>Elimine distrações durante os períodos de estudo</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4 sm:py-6">
              <CardTitle className="text-lg sm:text-xl">Benefícios do rastreamento de estudo</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full p-1 mr-2 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"></path></svg>
                  </span>
                  <span>Visualize seu progresso e mantenha-se motivado</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full p-1 mr-2 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"></path></svg>
                  </span>
                  <span>Identifique padrões e otimize seu tempo de estudo</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full p-1 mr-2 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"></path></svg>
                  </span>
                  <span>Estabeleça metas realistas baseadas em dados</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full p-1 mr-2 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"></path></svg>
                  </span>
                  <span>Equilibre o tempo entre diferentes disciplinas</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TimerPage;
