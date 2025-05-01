
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useStudy } from "@/context/StudyContext";
import { ContentType } from "@/types/study";

interface AddSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const contentTypes: { value: ContentType; label: string }[] = [
  { value: 'video', label: 'Vídeo' },
  { value: 'leitura', label: 'Leitura' },
  { value: 'exercício', label: 'Exercício' },
  { value: 'revisão', label: 'Revisão' },
  { value: 'outro', label: 'Outro' },
];

const AddSessionDialog = ({ isOpen, onClose }: AddSessionDialogProps) => {
  const { subjects, addManualSession } = useStudy();
  
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedContentType, setSelectedContentType] = useState<ContentType>("leitura");
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState<string>("0");
  const [minutes, setMinutes] = useState<string>("30");
  
  const handleSubmit = () => {
    const subject = subjects.find(s => s.id === selectedSubject);
    if (!subject) return;
    
    // Convert hours and minutes to seconds
    const totalSeconds = (parseInt(hours) * 3600) + (parseInt(minutes) * 60);
    
    // Create study session
    addManualSession({
      date: new Date(date).toISOString(),
      subject,
      contentType: selectedContentType,
      duration: totalSeconds,
    });
    
    // Reset form and close dialog
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setSelectedSubject("");
    setSelectedContentType("leitura");
    setDate(new Date().toISOString().split('T')[0]);
    setHours("0");
    setMinutes("30");
  };
  
  const isFormValid = selectedSubject && (parseInt(hours) > 0 || parseInt(minutes) > 0);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar sessão manual</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium col-span-1">Data</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="col-span-3"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium col-span-1">Matéria</label>
            <Select 
              value={selectedSubject}
              onValueChange={setSelectedSubject}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione a matéria" />
              </SelectTrigger>
              <SelectContent>
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
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium col-span-1">Tipo</label>
            <Select 
              value={selectedContentType}
              onValueChange={(value) => setSelectedContentType(value as ContentType)}
            >
              <SelectTrigger className="col-span-3">
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
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium col-span-1">Duração</label>
            <div className="col-span-3 flex items-center space-x-2">
              <Input
                type="number"
                min="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-20"
              />
              <span>horas</span>
              <Input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-20"
              />
              <span>min</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button 
            className="gradient-purple-blue" 
            onClick={handleSubmit} 
            disabled={!isFormValid}
          >
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSessionDialog;
