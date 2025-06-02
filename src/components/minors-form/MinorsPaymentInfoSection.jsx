import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Banknote, Info, CalendarClock, Copy, Landmark } from 'lucide-react';
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const MinorsPaymentInfoSection = ({ paymentInstructions, priceTiers, detailsTitle }) => {
  const { toast } = useToast();

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copiado",
        description: `${fieldName} copiado al portapapeles.`,
      });
    }).catch(err => {
      console.error('Error al copiar: ', err);
      toast({
        title: "Error",
        description: `No se pudo copiar ${fieldName}.`,
        variant: "destructive",
      });
    });
  };
  
  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900/50 rounded-xl border border-primary/40 shadow-2xl">
      <h3 className="text-2xl font-bold text-primary mb-4 border-b-2 border-primary/30 pb-3 flex items-center">
        <Banknote className="h-6 w-6 mr-3 text-primary" /> {detailsTitle || "Datos para la Transferencia"}
      </h3>
      
      {priceTiers && priceTiers.length > 0 && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-primary mb-3 flex items-center">
            <CalendarClock size={20} className="mr-2" /> Valores de Inscripción:
          </h4>
          <ul className="space-y-1.5 text-sm text-foreground/90">
            {priceTiers.map((tier, index) => (
              <li key={index} className="flex justify-between items-center">
                <span><span className="font-semibold">{tier.price}</span> ({tier.period})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {paymentInstructions && paymentInstructions.length > 0 ? (
        <Table className="w-full">
          <TableBody>
            {paymentInstructions.sort((a, b) => a.display_order - b.display_order).map((item) => (
              <TableRow key={item.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                <TableCell className="font-semibold text-muted-foreground w-1/3 py-3 px-4 flex items-center">
                  <Landmark size={16} className="mr-2 text-primary/70" />
                  {item.label}:
                </TableCell>
                <TableCell className="text-foreground py-3 px-4 flex justify-between items-center">
                  <span>{item.value}</span>
                  {(item.instruction_key === "alias" || item.instruction_key === "cbu") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(item.value, item.label)}
                      className="p-1 h-auto text-primary hover:text-primary/80"
                      aria-label={`Copiar ${item.label}`}
                    >
                      <Copy size={16} />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {paymentInstructions.find(pi => pi.instruction_key === 'details') && (
              <TableRow className="border-b border-slate-700 hover:bg-slate-700/30">
                <TableCell className="font-semibold text-muted-foreground w-1/3 py-3 px-4 flex items-center">
                    <Info size={16} className="mr-2 text-primary/70" />
                    Info Adicional:
                </TableCell>
                <TableCell className="text-foreground py-3 px-4 text-sm">
                    {paymentInstructions.find(pi => pi.instruction_key === 'details').value}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <p className="text-muted-foreground text-center">No hay instrucciones de pago disponibles.</p>
      )}

      <div className="mt-6 p-4 bg-yellow-600/10 border border-yellow-500/40 rounded-lg text-yellow-300 text-sm flex items-start shadow">
        <Info size={20} className="mr-3 mt-0.5 flex-shrink-0 text-yellow-400" />
        <span>Recuerda adjuntar el comprobante de pago más abajo. La inscripción no será válida sin el comprobante.</span>
      </div>
    </div>
  );
};

export default MinorsPaymentInfoSection;