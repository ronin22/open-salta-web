import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; 
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Edit, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';


const initialInstructionFormData = {
  id: null,
  instruction_key: '',
  label: '',
  value: '',
  details: '',
  display_order: 0,
};

const PaymentInstructionsManager = ({ initialInstructions, loading: propLoading, fetchInstructions }) => {
  const { toast } = useToast();
  const [instructions, setInstructions] = useState(initialInstructions || []);
  const [isInstructionDialogOpen, setIsInstructionDialogOpen] = useState(false);
  const [instructionFormData, setInstructionFormData] = useState(initialInstructionFormData);
  const [editingInstruction, setEditingInstruction] = useState(null);
  const [isLoading, setIsLoading] = useState(propLoading);

  useEffect(() => {
    setInstructions(initialInstructions || []);
  }, [initialInstructions]);

  useEffect(() => {
    setIsLoading(propLoading);
  }, [propLoading]);

  const handleInstructionInputChange = (e) => {
    const { name, value } = e.target;
    setInstructionFormData(prev => ({ 
      ...prev, 
      [name]: name === 'display_order' ? parseInt(value, 10) || 0 : value 
    }));
  };

  const handleSaveInstruction = async () => {
    if (!instructionFormData.label || !instructionFormData.value) {
      toast({ title: "Error de validación", description: "La etiqueta y el valor son obligatorios.", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);
    try {
      const dataToSave = { ...instructionFormData };
      
      let response;
      if (editingInstruction) {
        const { id, instruction_key, ...updateData } = dataToSave; 
        response = await supabase.from('payment_instructions').update(updateData).eq('id', editingInstruction.id).select();
      } else {
        toast({ title: "Info", description: "La creación de nuevas instrucciones no está habilitada desde aquí. Edita las existentes.", variant: "default" });
        setIsLoading(false);
        return;
      }
      
      if (response.error) throw response.error;

      toast({ title: "Éxito", description: `Instrucción de pago actualizada correctamente.` });
      setIsInstructionDialogOpen(false);
      setEditingInstruction(null);
      setInstructionFormData(initialInstructionFormData);
      if (fetchInstructions) {
        fetchInstructions();
      }
    } catch (error) {
      toast({ title: "Error", description: `Error al guardar instrucción: ${error.message}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditInstruction = (instruction) => {
    setEditingInstruction(instruction);
    setInstructionFormData({ 
      ...instruction, 
      display_order: instruction.display_order || 0,
      details: instruction.details || '' 
    });
    setIsInstructionDialogOpen(true);
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-yellow-300 mb-2 flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-yellow-400" /> Nota Importante
        </h3>
        <p className="text-sm text-yellow-200">
          Actualmente, solo puedes editar las instrucciones de pago existentes. La adición o eliminación de nuevas claves de instrucción debe hacerse directamente en la base de datos o contactando al desarrollador para asegurar la consistencia con el código que las consume en la página principal.
        </p>
      </div>

      {isLoading && (!instructions || !instructions.length) ? <p className="text-center text-muted-foreground py-4">Cargando instrucciones de pago...</p> : (
        <div className="overflow-x-auto bg-card p-4 rounded-lg shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Orden</TableHead>
                <TableHead className="w-[200px]">Etiqueta (Visible al usuario)</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Detalles Adicionales</TableHead>
                <TableHead className="text-right w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instructions.sort((a,b) => a.display_order - b.display_order).map((instruction) => (
                <TableRow key={instruction.id}>
                  <TableCell>{instruction.display_order}</TableCell>
                  <TableCell className="font-medium text-primary">{instruction.label}</TableCell>
                  <TableCell>{instruction.value}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{instruction.details || '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleEditInstruction(instruction)} className="border-primary text-primary hover:bg-primary/10">
                      <Edit className="h-4 w-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Editar</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isInstructionDialogOpen} onOpenChange={(isOpen) => { setIsInstructionDialogOpen(isOpen); if (!isOpen) { setEditingInstruction(null); setInstructionFormData(initialInstructionFormData); } }}>
        <DialogContent className="sm:max-w-xl bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">Editar Instrucción de Pago</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instruction_key" className="text-right col-span-1 text-muted-foreground">Clave (Interna)</Label>
              <Input id="instruction_key" name="instruction_key" value={instructionFormData.instruction_key} className="col-span-3 bg-muted border-muted-foreground/30" disabled />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label" className="text-right col-span-1 text-muted-foreground">Etiqueta (Visible)</Label>
              <Input id="label" name="label" value={instructionFormData.label} onChange={handleInstructionInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right col-span-1 text-muted-foreground">Valor</Label>
              <Input id="value" name="value" value={instructionFormData.value} onChange={handleInstructionInputChange} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="details" className="text-right col-span-1 text-muted-foreground pt-2">Detalles Adicionales</Label>
              <Textarea id="details" name="details" value={instructionFormData.details || ''} onChange={handleInstructionInputChange} className="col-span-3 min-h-[80px]" placeholder="Información extra (opcional)"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="display_order" className="text-right col-span-1 text-muted-foreground">Orden</Label>
              <Input id="display_order" name="display_order" type="number" value={instructionFormData.display_order} onChange={handleInstructionInputChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveInstruction} disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default PaymentInstructionsManager;
