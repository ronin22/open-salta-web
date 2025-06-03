import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Edit, PlusCircle } from 'lucide-react';

const initialSponsorFormData = {
  id: null,
  name: '',
  logo_url: '',
  website_url: '',
  instagram_url: '',
  facebook_url: '',
  twitter_url: '',
  display_order: 0,
};

const SponsorsManager = ({ initialSponsors, loading: propLoading, fetchSponsors }) => {
  const { toast } = useToast();
  const [sponsors, setSponsors] = useState(initialSponsors);
  const [isSponsorDialogOpen, setIsSponsorDialogOpen] = useState(false);
  const [sponsorFormData, setSponsorFormData] = useState(initialSponsorFormData);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [isLoading, setIsLoading] = useState(propLoading);

  React.useEffect(() => {
    setSponsors(initialSponsors);
  }, [initialSponsors]);

  React.useEffect(() => {
    setIsLoading(propLoading);
  }, [propLoading]);


  const handleSponsorInputChange = (e) => {
    const { name, value } = e.target;
    setSponsorFormData(prev => ({ ...prev, [name]: name === 'display_order' ? parseInt(value, 10) || 0 : value }));
  };

  const handleSaveSponsor = async () => {
    if (!sponsorFormData.name) {
      toast({ title: "Error de validación", description: "El nombre del patrocinador es obligatorio.", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);
    try {
      const dataToSave = { ...sponsorFormData };
      
      let response;
      if (editingSponsor) {
        const {id, ...updateData} = dataToSave;
        response = await supabase.from('sponsors').update(updateData).eq('id', editingSponsor.id).select();
      } else {
        const {id, ...insertData} = dataToSave;
        response = await supabase.from('sponsors').insert([insertData]).select();
      }
      
      if (response.error) throw response.error;
      toast({ title: "Éxito", description: `Patrocinador ${editingSponsor ? 'actualizado' : 'guardado'} correctamente.` });
      setIsSponsorDialogOpen(false);
      setEditingSponsor(null);
      setSponsorFormData(initialSponsorFormData);
      fetchSponsors(); // Refresh sponsors list
    } catch (error) {
      toast({ title: "Error", description: `Error al guardar patrocinador: ${error.message}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditSponsor = (sponsor) => {
    setEditingSponsor(sponsor);
    setSponsorFormData({ ...sponsor, display_order: sponsor.display_order || 0 });
    setIsSponsorDialogOpen(true);
  };

  const handleDeleteSponsor = async (sponsorId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este patrocinador?")) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.from('sponsors').delete().eq('id', sponsorId);
      if (error) throw error;
      toast({ title: "Éxito", description: "Patrocinador eliminado." });
      fetchSponsors(); // Refresh sponsors list
    } catch (error) {
      toast({ title: "Error", description: `Error al eliminar patrocinador: ${error.message}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
       <Button onClick={() => { setEditingSponsor(null); setSponsorFormData(initialSponsorFormData); setIsSponsorDialogOpen(true); }} className="bg-primary hover:bg-primary/90">
        <PlusCircle className="mr-2 h-4 w-4" /> Añadir Patrocinador
      </Button>
      {isLoading && !sponsors.length ? <p>Cargando patrocinadores...</p> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Orden</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Logo</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sponsors.map((sponsor) => (
              <TableRow key={sponsor.id}>
                <TableCell>{sponsor.display_order}</TableCell>
                <TableCell>{sponsor.name}</TableCell>
                <TableCell>
                  {sponsor.logo_url ? <img src={sponsor.logo_url} alt={sponsor.name} className="h-10 w-auto object-contain bg-white p-1 rounded"/> : 'N/A'}
                </TableCell>
                <TableCell>
                  <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {sponsor.website_url ? 'Visitar' : 'N/A'}
                  </a>
                </TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditSponsor(sponsor)}><Edit className="h-4 w-4"/></Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteSponsor(sponsor.id)}><Trash2 className="h-4 w-4"/></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
       <Dialog open={isSponsorDialogOpen} onOpenChange={(isOpen) => { setIsSponsorDialogOpen(isOpen); if (!isOpen) { setEditingSponsor(null); setSponsorFormData(initialSponsorFormData); } }}>
        <DialogContent className="sm:max-w-[525px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-primary">{editingSponsor ? 'Editar' : 'Añadir'} Patrocinador</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {[
              {id: "name", label: "Nombre", type: "text"},
              {id: "logo_url", label: "URL del Logo", type: "text", placeholder: "Sube a Supabase Storage y pega la URL aquí"},
              {id: "website_url", label: "URL Sitio Web", type: "text"},
              {id: "instagram_url", label: "URL Instagram", type: "text"},
              {id: "facebook_url", label: "URL Facebook", type: "text"},
              {id: "twitter_url", label: "URL Twitter/X", type: "text"},
              {id: "display_order", label: "Orden de Visualización", type: "number"}
            ].map(field => (
              <div className="grid grid-cols-4 items-center gap-4" key={field.id}>
                <Label htmlFor={field.id} className="text-right text-muted-foreground">{field.label}</Label>
                <Input id={field.id} name={field.id} type={field.type} value={sponsorFormData[field.id] || ''} onChange={handleSponsorInputChange} className="col-span-3" placeholder={field.placeholder || ''}/>
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveSponsor} disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? 'Guardando...' : 'Guardar Patrocinador'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorsManager;