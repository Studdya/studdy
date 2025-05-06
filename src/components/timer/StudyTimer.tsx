
import { useState, useEffect, useRef } from "react";
import { useStudy } from "@/context/StudyContext";
import { Subject, ContentType } from "@/types/study";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Save, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import AddSubjectDialog from "@/components/subjects/AddSubjectDialog";

const contentTypes: { value: ContentType; label: string }[] = [
  { value: 'video', label: 'Vídeo' },
  { value: 'leitura', label: 'Leitura' },
  { value: 'exercício', label: 'Exercício' },
  { value: 'revisão', label: 'Revisão' },
  { value: 'outro', label: 'Outro' },
];

const StudyTimer = () => {
  const { subjects, addSession } = useStudy();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('leitura');
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [isAddSubjectDialogOpen, setIsAddSubjectDialogOpen] = useState(false);
  
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const elapsedTimeRef = useRef<number>(0);
  
  useEffect(() => {
    // Synchronize the timer with visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRunning) {
        // Tab is visible again, update the timer based on actual elapsed time
        updateTimerOnVisibilityChange();
      }
    };
    
    // Add visibility change event listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      // Clean up
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning]);
  
  // Update timer when tab becomes visible again
  const updateTimerOnVisibilityChange = () => {
    if (!isRunning || startTimeRef.current === null) return;
    
    // Calculate elapsed time based on the real time difference
    const now = Date.now();
    const additionalSeconds = Math.floor((now - startTimeRef.current) / 1000);
    
    // Update elapsed time and seconds state
    elapsedTimeRef.current = additionalSeconds;
    setSeconds(additionalSeconds);
    
    // Reset start time to current time
    startTimeRef.current = now;
  };
  
  const toggleTimer = () => {
    if (!selectedSubject) {
      toast.error("Selecione uma matéria para iniciar o cronômetro");
      return;
    }
    
    if (isRunning) {
      // Stop the timer
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      // Save the elapsed time
      elapsedTimeRef.current = seconds;
      startTimeRef.current = null;
      setIsRunning(false);
    } else {
      // Start the timer
      // Set the start time
      const now = Date.now();
      startTimeRef.current = now - elapsedTimeRef.current * 1000; // Adjust for previously elapsed time
      
      // Set up the interval
      intervalRef.current = window.setInterval(() => {
        // Calculate seconds based on elapsed time
        const currentElapsed = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0;
        setSeconds(currentElapsed);
      }, 1000);
      
      setIsRunning(true);
      setSessionSaved(false);
    }
  };
  
  const saveSession = async () => {
    if (!selectedSubject || seconds === 0) {
      toast.error("Selecione uma matéria e garanta que o tempo seja maior que zero");
      return;
    }
    
    try {
      await addSession({
        date: new Date().toISOString(),
        subject: selectedSubject,
        contentType: selectedContentType,
        duration: seconds,
      });
      
      setSeconds(0);
      elapsedTimeRef.current = 0;
      startTimeRef.current = null;
      setIsRunning(false);
      setSessionSaved(true);
      
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    } catch (error) {
      console.error("Erro ao salvar sessão:", error);
      toast.error("Houve um erro ao salvar a sessão de estudo");
    }
  };
  
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <Card className="glass-card w-full max-w-3xl mx-auto rounded-xl">
      <CardContent className="p-4 sm:p-8 flex flex-col items-center">
        <div className="flex flex-col w-full gap-4 mb-8 sm:mb-12">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Matéria</label>
            <div className="flex space-x-2">
              <Select 
                value={selectedSubject?.id || ""}
                onValueChange={(value) => {
                  const subject = subjects.find(s => s.id === value);
                  setSelectedSubject(subject || null);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a matéria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Matérias</SelectLabel>
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
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button 
                size="icon" 
                variant="outline" 
                onClick={() => setIsAddSubjectDialogOpen(true)}
                title="Adicionar nova matéria"
              >
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Tipo de Conteúdo</label>
            <Select 
              value={selectedContentType}
              onValueChange={(value) => setSelectedContentType(value as ContentType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((contentType) => (
                  <SelectItem key={contentType.value} value={contentType.value}>
                    {contentType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="text-center mb-8 sm:mb-12">
          <div className="text-4xl sm:text-7xl font-medium tracking-tighter mb-6">{formatTime(seconds)}</div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              variant="outline" 
              className={`px-6 sm:px-8 py-5 sm:py-6 rounded-full text-base sm:text-lg w-full sm:w-auto ${
                isRunning ? "border-red-400 text-red-600" : "border-green-400 text-green-600"
              }`}
              onClick={toggleTimer}
            >
              {isRunning ? (
                <><Pause className="mr-2" size={20} /> Pausar</>
              ) : (
                <><Play className="mr-2" size={20} /> Iniciar</>
              )}
            </Button>
            
            <Button
              size="lg"
              variant="default"
              className="gradient-purple-blue px-6 sm:px-8 py-5 sm:py-6 rounded-full text-base sm:text-lg w-full sm:w-auto"
              onClick={saveSession}
              disabled={seconds === 0 || !selectedSubject}
            >
              <Save className="mr-2" size={20} /> Salvar Sessão
            </Button>
          </div>
          
          {!selectedSubject && (
            <p className="text-sm text-muted-foreground mt-4">
              Selecione uma matéria para começar
            </p>
          )}
          
          {sessionSaved && (
            <p className="text-sm text-green-600 mt-4">
              Sessão salva com sucesso!
            </p>
          )}
        </div>
      </CardContent>
      
      <AddSubjectDialog 
        isOpen={isAddSubjectDialogOpen} 
        onClose={() => setIsAddSubjectDialogOpen(false)} 
      />
    </Card>
  );
};

export default StudyTimer;
