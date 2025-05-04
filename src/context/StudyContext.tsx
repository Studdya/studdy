
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { StudySession, Subject, ContentType } from "@/types/study";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Default subjects
const defaultSubjects: Subject[] = [
  { id: "1", name: "Matemática", color: "#8b5cf6" },
  { id: "2", name: "Português", color: "#3b82f6" },
  { id: "3", name: "História", color: "#10b981" },
  { id: "4", name: "Geografia", color: "#f59e0b" },
  { id: "5", name: "Ciências", color: "#ec4899" }
];

interface StudyContextType {
  sessions: StudySession[];
  subjects: Subject[];
  addSession: (session: Omit<StudySession, "id">) => void;
  addManualSession: (session: Omit<StudySession, "id">) => void;
  deleteSession: (id: string) => void;
  getSessionsByMonth: (month: number, year: number) => StudySession[];
  getSessionsBySubject: (subjectId: string) => StudySession[];
  getSessionsByDateRange: (startDate: Date, endDate: Date) => StudySession[];
  getTotalDurationBySubject: (subjectId: string) => number;
  getStudyDays: (month: number, year: number) => number;
  loading: boolean;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast: uiToast } = useToast();

  // Carregar dados do Supabase quando o usuário estiver autenticado
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Verificar se o usuário está autenticado
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("Usuário não autenticado");
          setLoading(false);
          return;
        }
        
        // Carregar disciplinas (subjects)
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('subjects')
          .select('*');
        
        if (subjectsError) {
          throw subjectsError;
        }
        
        if (subjectsData && subjectsData.length > 0) {
          // Converter dados do formato da tabela para o formato da aplicação
          const formattedSubjects: Subject[] = subjectsData.map(subject => ({
            id: subject.id,
            name: subject.name,
            color: subject.color
          }));
          setSubjects(formattedSubjects);
        } else {
          // Se não existirem matérias, cadastrar as matérias padrão
          await createDefaultSubjects(session.user.id);
          setSubjects(defaultSubjects);
        }
        
        // Carregar sessões de estudo
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('study_sessions')
          .select(`
            id,
            date,
            duration,
            content_type,
            subjects (
              id,
              name,
              color
            )
          `);
        
        if (sessionsError) {
          throw sessionsError;
        }
        
        if (sessionsData) {
          // Converter dados do formato da tabela para o formato da aplicação
          const formattedSessions: StudySession[] = sessionsData.map(session => ({
            id: session.id,
            date: session.date,
            duration: session.duration,
            contentType: session.content_type as ContentType,
            subject: {
              id: session.subjects.id,
              name: session.subjects.name,
              color: session.subjects.color
            }
          }));
          setSessions(formattedSessions);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar seus dados de estudo");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchData();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Função para criar as matérias padrão para um novo usuário
  const createDefaultSubjects = async (userId: string) => {
    try {
      for (const subject of defaultSubjects) {
        const { error } = await supabase
          .from('subjects')
          .insert({
            name: subject.name,
            color: subject.color,
            user_id: userId
          });
          
        if (error) throw error;
      }
    } catch (error) {
      console.error("Erro ao criar disciplinas padrão:", error);
    }
  };

  const addSession = async (session: Omit<StudySession, "id">) => {
    try {
      // Verificar se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado para salvar sessões de estudo");
        return;
      }
      
      // Inserir sessão no Supabase
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          subject_id: session.subject.id,
          content_type: session.contentType,
          duration: session.duration,
          date: session.date,
          user_id: user.id
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      // Adicionar sessão ao estado
      const newSession = {
        ...session,
        id: data.id
      };
      
      setSessions(prev => [...prev, newSession]);
      
      uiToast({
        title: "Sessão de estudo salva",
        description: `${session.subject.name} - ${formatMinutes(session.duration / 60)}`,
      });
    } catch (error) {
      console.error("Erro ao salvar sessão:", error);
      toast.error("Erro ao salvar sessão de estudo");
    }
  };

  const addManualSession = async (session: Omit<StudySession, "id">) => {
    try {
      // Verificar se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado para adicionar sessões de estudo");
        return;
      }
      
      // Inserir sessão no Supabase
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          subject_id: session.subject.id,
          content_type: session.contentType,
          duration: session.duration,
          date: session.date,
          user_id: user.id
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      // Adicionar sessão ao estado
      const newSession = {
        ...session,
        id: data.id
      };
      
      setSessions(prev => [...prev, newSession]);
      
      uiToast({
        title: "Sessão manual adicionada",
        description: `${session.subject.name} - ${formatMinutes(session.duration / 60)}`,
      });
    } catch (error) {
      console.error("Erro ao adicionar sessão manual:", error);
      toast.error("Erro ao adicionar sessão manual");
    }
  };

  const deleteSession = async (id: string) => {
    try {
      // Deletar sessão no Supabase
      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remover sessão do estado
      setSessions(prev => prev.filter(session => session.id !== id));
      
      uiToast({
        title: "Sessão removida",
        description: "A sessão de estudo foi removida com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao remover sessão:", error);
      toast.error("Erro ao remover sessão de estudo");
    }
  };

  const getSessionsByMonth = (month: number, year: number) => {
    return sessions.filter(session => {
      const date = new Date(session.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  };

  const getSessionsBySubject = (subjectId: string) => {
    return sessions.filter(session => session.subject.id === subjectId);
  };

  const getSessionsByDateRange = (startDate: Date, endDate: Date) => {
    return sessions.filter(session => {
      const date = new Date(session.date);
      return date >= startDate && date <= endDate;
    });
  };

  const getTotalDurationBySubject = (subjectId: string) => {
    return sessions
      .filter(session => session.subject.id === subjectId)
      .reduce((total, session) => total + session.duration, 0);
  };

  const getStudyDays = (month: number, year: number) => {
    const sessionsInMonth = getSessionsByMonth(month, year);
    const daysSet = new Set(
      sessionsInMonth.map(session => new Date(session.date).getDate())
    );
    return daysSet.size;
  };

  return (
    <StudyContext.Provider 
      value={{
        sessions,
        subjects,
        addSession,
        addManualSession,
        deleteSession,
        getSessionsByMonth,
        getSessionsBySubject,
        getSessionsByDateRange,
        getTotalDurationBySubject,
        getStudyDays,
        loading
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error("useStudy must be used within a StudyProvider");
  }
  return context;
};

const formatMinutes = (minutes: number) => {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  
  if (hrs > 0) {
    return `${hrs}h ${mins}min`;
  }
  return `${mins} minutos`;
};
