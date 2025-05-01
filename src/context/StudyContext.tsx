
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { StudySession, Subject, ContentType } from "@/types/study";
import { useToast } from "@/components/ui/use-toast";

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
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) return defaultValue;
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Error loading from localStorage:", e);
    return defaultValue;
  }
};

export const StudyProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<StudySession[]>(() => loadFromLocalStorage("study_sessions", []));
  const [subjects, setSubjects] = useState<Subject[]>(() => loadFromLocalStorage("study_subjects", defaultSubjects));
  const { toast } = useToast();

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem("study_sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("study_subjects", JSON.stringify(subjects));
  }, [subjects]);

  const addSession = (session: Omit<StudySession, "id">) => {
    const newSession = {
      ...session,
      id: crypto.randomUUID()
    };
    setSessions(prev => [...prev, newSession]);
    toast({
      title: "Sessão de estudo salva",
      description: `${session.subject.name} - ${formatMinutes(session.duration / 60)}`,
    });
  };

  const addManualSession = (session: Omit<StudySession, "id">) => {
    const newSession = {
      ...session,
      id: crypto.randomUUID()
    };
    setSessions(prev => [...prev, newSession]);
    toast({
      title: "Sessão manual adicionada",
      description: `${session.subject.name} - ${formatMinutes(session.duration / 60)}`,
    });
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
    toast({
      title: "Sessão removida",
      description: "A sessão de estudo foi removida com sucesso.",
    });
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
