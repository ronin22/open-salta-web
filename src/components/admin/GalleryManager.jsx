import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit, PlusCircle } from 'lucide-react';

const initialGalleryItemFormData = {
  id: null,
  type: 'image',
  title: '',
  alt_text: '',
  image_url: '',
  video_url: '',
  display_order: 0,
};

const GalleryManager = ({ initialGalleryItems, loading: propLoading, fetchGalleryItems }) => {
  const { toast } = useToast();
  const [galleryItems, setGalleryItems] = useState(initialGalleryItems);
  const [isGalleryItemDialogOpen, setIsGalleryItemDialogOpen] = useState(false);
  const [galleryItemFormData, setGalleryItemFormData] = useState(initialGalleryItemFormData);
  const [editingGalleryItem, setEditingGalleryItem] = useState(null);
  const [isLoading, setIsLoading] = useState(propLoading);

  React.useEffect(() => {
    setGalleryItems(initialGalleryItems);
  }, [initialGalleryItems]);

  React.useEffect(() => {
    setIsLoading(propLoading);
  }, [propLoading]);

  const handleGalleryItemInputChange = (e) => {
    const { name, value } = e.target;
    setGalleryItemFormData(prev => ({ ...prev, [name]: name === 'display_order' ? parseInt(value, 10) || 0 : value }));
  };
  
  const handleGalleryItemSelectChange = (name, value) => {
    setGalleryItemFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveGalleryItem = async () => {
    if (!galleryItemFormData.title || !galleryItemFormData.image_url) {
      toast({ title: "Error de validación", description: "El título y la URL de la imagen son obligatorios.", variant: "destructive" });
      return;
    }
    if (galleryItemFormData.type === 'video' && !galleryItemFormData.video_url) {
      toast({ title: "Error de validación", description: "La URL del video es obligatoria para tipo video.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const dataToSave = { ...galleryItemFormData };

      let response;
      if (editingGalleryItem) {
        const {id, ...updateData} = dataToSave;
        response = await supabase.from('gallery_items').update(updateData).eq('id', editingGalleryItem.id).select();
      } else {
         const {id, ...insertData} = dataToSave;
        response = await supabase.from('gallery_items').insert([insertData]).select();
      }
      
      if (response.error) throw response.error;
      toast({ title: "Éxito", description: `Elemento de galería ${editingGalleryItem ? 'actualizado' : 'guardado'} correctamente.` });
      setIsGalleryItemDialogOpen(false);
      setEditingGalleryItem(null);
      setGalleryItemFormData(initialGalleryItemFormData);
      fetchGalleryItems(); 
    } catch (error) {
      toast({ title: "Error", description: `Error al guardar elemento de galería: ${error.message}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditGalleryItem = (item) => {
    setEditingGalleryItem(item);
    setGalleryItemFormData({ ...item, display_order: item.display_order || 0 });
    setIsGalleryItemDialogOpen(true);
  };

  const handleDeleteGalleryItem = async (itemId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este elemento de la galería?")) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.from('gallery_items').delete().eq('id', itemId);
      if (error) throw error;
      toast({ title: "Éxito", description: "Elemento de galería eliminado." });
      fetchGalleryItems();
    } catch (error) {
      toast({ title: "Error", description: `Error al eliminar elemento de galería: ${error.message}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
     <div className="space-y-4">
      <Button onClick={() => { setEditingGalleryItem(null); setGalleryItemFormData(initialGalleryItemFormData); setIsGalleryItemDialogOpen(true); }} className="bg-primary hover:bg-primary/90">
        <PlusCircle className="mr-2 h-4 w-4" /> Añadir Elemento a Galería
      </Button>
      {isLoading && !galleryItems.length ? <p>Cargando elementos de la galería...</p> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Orden</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Imagen</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {galleryItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.display_order}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  {item.image_url ? <img src={item.image_url} alt={item.title} className="h-10 w-auto object-contain bg-white p-1 rounded"/> : 'N/A'}
                </TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditGalleryItem(item)}><Edit className="h-4 w-4"/></Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteGalleryItem(item.id)}><Trash2 className="h-4 w-4"/></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Dialog open={isGalleryItemDialogOpen} onOpenChange={(isOpen) => { setIsGalleryItemDialogOpen(isOpen); if(!isOpen) { setEditingGalleryItem(null); setGalleryItemFormData(initialGalleryItemFormData); }}}>
        <DialogContent className="sm:max-w-[525px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-primary">{editingGalleryItem ? 'Editar' : 'Añadir'} Elemento a Galería</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right text-muted-foreground">Tipo</Label>
                <Select name="type" value={galleryItemFormData.type} onValueChange={(value) => handleGalleryItemSelectChange('type', value)}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="image">Imagen</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {[
              {id: "title", label: "Título", type: "text"},
              {id: "alt_text", label: "Texto Alternativo (SEO)", type: "text"},
              {id: "image_url", label: "URL de Imagen", type: "text", placeholder: "Sube a Supabase Storage y pega la URL"},
              {id: "video_url", label: "URL de Video (si aplica)", type: "text", condition: galleryItemFormData.type === 'video'},
              {id: "display_order", label: "Orden de Visualización", type: "number"}
            ].map(field => (
               (field.condition === undefined || field.condition) &&
              <div className="grid grid-cols-4 items-center gap-4" key={field.id}>
                <Label htmlFor={field.id} className="text-right text-muted-foreground">{field.label}</Label>
                <Input id={field.id} name={field.id} type={field.type} value={galleryItemFormData[field.id] || ''} onChange={handleGalleryItemInputChange} className="col-span-3" placeholder={field.placeholder || ''} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveGalleryItem} disabled={isLoading} className="bg-primary hover:bg-primary/90">
                {isLoading ? 'Guardando...' : 'Guardar Elemento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryManager;