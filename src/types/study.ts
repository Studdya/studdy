
export type ContentType = 'video' | 'leitura' | 'exercício' | 'revisão' | 'outro';

export type Subject = {
  id: string;
  name: string;
  color: string;
};

export type StudySession = {
  id: string;
  date: string; // ISO string
  subject: Subject;
  contentType: ContentType;
  duration: number; // Duration in seconds
};
