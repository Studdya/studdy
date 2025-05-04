
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BlockPicker } from 'react-color';
import { useStudy } from "@/context/StudyContext";

interface AddSubjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSubjectDialog = ({ isOpen, onClose }: AddSubjectDialogProps) => {
  const { subjects } = useStudy();
  const [subjectName, setSubjectName] = useState<string>("");
  const [color, setColor] = useState<string>("#8b5cf6");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleSubmit = async () => {
    if (!subjectName.trim()) {
      toast.error("Por favor, insira um nome para a matéria");
      return;
    }
    
    // Check if subject with same name already exists
    if (subjects.some(subject => subject.name.toLowerCase() === subjectName.trim().toLowerCase())) {
      toast.error("Uma matéria com este nome já existe");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Get user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado para adicionar matérias");
        return;
      }
      
      // Insert subject into database
      const { error } = await supabase
        .from('subjects')
        .insert({
          name: subjectName.trim(),
          color: color,
          user_id: user.id
        });
      
      if (error) throw error;
      
      toast.success(`Matéria "${subjectName}" adicionada com sucesso!`);
      
      // Reset form and close dialog
      setSubjectName("");
      setColor("#8b5cf6");
      onClose();
      
    } catch (error) {
      console.error("Erro ao adicionar matéria:", error);
      toast.error("Houve um erro ao adicionar a matéria");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar nova matéria</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium col-span-1">Nome</label>
            <Input
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Nome da matéria"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium col-span-1">Cor</label>
            <div className="col-span-3">
              <div 
                className="w-full h-10 rounded cursor-pointer border flex items-center justify-center mb-2"
                style={{ backgroundColor: color }}
                onClick={() => {}}
              >
                <span className="text-white text-shadow">{color}</span>
              </div>
              <BlockPicker 
                color={color}
                onChange={(color) => setColor(color.hex)}
                colors={[
                  '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899',
                  '#ef4444', '#64748b', '#0ea5e9', '#84cc16', '#d946ef'
                ]}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button 
            className="gradient-purple-blue" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Adicionando..." : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubjectDialog;
