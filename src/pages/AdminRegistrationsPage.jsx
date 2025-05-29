import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const AdminRegistrationsPage = () => {
  const [adultRegistrations, setAdultRegistrations] = useState([]);
  const [minorRegistrations, setMinorRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      try {
        const { data: adultsData, error: adultsError } = await supabase
          .from('adults_registrations')
          .select('*')
          .order('created_at', { ascending: false });

        if (adultsError) throw adultsError;
        setAdultRegistrations(adultsData || []);

        const { data: minorsData, error: minorsError } = await supabase
          .from('minors_registrations')
          .select('*')
          .order('created_at', { ascending: false });

        if (minorsError) throw minorsError;
        setMinorRegistrations(minorsData || []);

      } catch (error) {
        console.error("Error fetching registrations:", error);
        toast({
          title: "Error al cargar inscripciones",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [toast]);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'yellow';
      case 'approved':
      case 'confirmado': return 'green';
      case 'rejected': return 'red';
      default: return 'secondary';
    }
  };

  const renderFileLink = (url, label) => {
    if (!url) return <span className="text-muted-foreground/70 text-xs">No {label}</span>;
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center">
        <Eye size={14} className="mr-1" /> Ver {label}
      </a>
    );
  };
  
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      toast({ title: "Sin datos", description: "No hay datos para exportar.", variant: "default" });
      return;
    }
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(value => `"${String(value || '').replace(/"/g, '""')}"`).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [header, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Exportado", description: `${filename}.csv descargado.`, variant: "default" });
  };


  const commonColumnsAdults = [
    { header: "Nombre", accessor: row => `${row.first_name} ${row.last_name}` },
    { header: "Email", accessor: row => row.email },
    { header: "Categoría Peso", accessor: row => row.weight_category },
    { header: "Cinturón", accessor: row => row.belt_rank },
    { header: "Academia", accessor: row => row.academy === "Otra" ? row.other_academy : row.academy },
    { header: "F. Inscripción", accessor: row => formatDate(row.created_at) },
    { header: "Estado", accessor: row => <Badge variant={getStatusBadgeVariant(row.registration_status)}>{row.registration_status || 'N/A'}</Badge> },
  ];

  const commonColumnsMinors = [
    { header: "Nombre Menor", accessor: row => `${row.child_first_name} ${row.child_last_name}` },
    { header: "Email Tutor", accessor: row => row.parent_email },
    { header: "Categoría Peso", accessor: row => row.child_weight_category },
    { header: "Cinturón", accessor: row => row.child_belt_rank },
    { header: "Academia", accessor: row => row.child_academy === "Otra" ? row.child_other_academy : row.child_academy },
    { header: "F. Inscripción", accessor: row => formatDate(row.created_at) },
    { header: "Estado", accessor: row => <Badge variant={getStatusBadgeVariant(row.registration_status)}>{row.registration_status || 'N/A'}</Badge> },
  ];

  const documentColumnsAdults = [
    { header: "Apto Médico", accessor: row => renderFileLink(row.medical_cert_url, 'Apto') },
    { header: "Pago", accessor: row => renderFileLink(row.payment_proof_url, 'Pago') },
    { header: "DNI", accessor: row => renderFileLink(row.dni_photo_url, 'DNI') },
  ];

  const documentColumnsMinors = [
    { header: "Apto Médico", accessor: row => renderFileLink(row.medical_cert_url, 'Apto') },
    { header: "Pago", accessor: row => renderFileLink(row.payment_proof_url, 'Pago') },
    { header: "DNI Menor", accessor: row => renderFileLink(row.dni_photo_child_url, 'DNI Menor') },
    { header: "DNI Tutor", accessor: row => renderFileLink(row.dni_photo_parent_url, 'DNI Tutor') },
  ];
  
  const adultsTableColumns = [...commonColumnsAdults, ...documentColumnsAdults];
  const minorsTableColumns = [...commonColumnsMinors, ...documentColumnsMinors];


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4 text-lg">Cargando inscripciones...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 gradient-text text-center"
      >
        Panel de Administrador de Inscripciones
      </motion.h1>

      <Tabs defaultValue="adults" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:max-w-md mx-auto mb-6">
          <TabsTrigger value="adults">Adultos ({adultRegistrations.length})</TabsTrigger>
          <TabsTrigger value="minors">Menores ({minorRegistrations.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="adults">
          <Card className="glassmorphism">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Inscripciones de Adultos</CardTitle>
                  <CardDescription>Lista de todos los adultos inscritos en el torneo.</CardDescription>
                </div>
                <Button onClick={() => exportToCSV(adultRegistrations, 'inscripciones_adultos')} variant="outline" size="sm">
                  <Download size={16} className="mr-2" /> Exportar CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {adultRegistrations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      {adultsTableColumns.map(col => <TableHead key={col.header}>{col.header}</TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adultRegistrations.map((reg) => (
                      <TableRow key={reg.id}>
                        {adultsTableColumns.map(col => <TableCell key={col.header}>{col.accessor(reg)}</TableCell>)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No hay inscripciones de adultos todavía.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="minors">
          <Card className="glassmorphism">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Inscripciones de Menores</CardTitle>
                  <CardDescription>Lista de todos los menores inscritos en el torneo.</CardDescription>
                </div>
                 <Button onClick={() => exportToCSV(minorRegistrations, 'inscripciones_menores')} variant="outline" size="sm">
                  <Download size={16} className="mr-2" /> Exportar CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {minorRegistrations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      {minorsTableColumns.map(col => <TableHead key={col.header}>{col.header}</TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {minorRegistrations.map((reg) => (
                      <TableRow key={reg.id}>
                        {minorsTableColumns.map(col => <TableCell key={col.header}>{col.accessor(reg)}</TableCell>)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No hay inscripciones de menores todavía.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminRegistrationsPage;