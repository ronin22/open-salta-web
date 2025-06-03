import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const RegistrationsTable = ({ data, type }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'confirmed':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Inscripción</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>DNI</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Fecha Inscripción</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Comprobante Pago</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? data.map((reg) => (
            <TableRow key={reg.id}>
              <TableCell className="font-medium">{reg.registration_id || 'N/A'}</TableCell>
              <TableCell>{type === 'adults' ? `${reg.first_name} ${reg.last_name}` : `${reg.child_first_name} ${reg.child_last_name}`}</TableCell>
              <TableCell>{type === 'adults' ? reg.dni : reg.child_dni}</TableCell>
              <TableCell>{type === 'adults' ? reg.email : reg.parent_email}</TableCell>
              <TableCell>{new Date(reg.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`whitespace-nowrap ${getStatusVariant(reg.registration_status)}`}>
                  {reg.registration_status || 'Desconocido'}
                </Badge>
              </TableCell>
              <TableCell>
                { reg.payment_proof_url ?
                  <a href={reg.payment_proof_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ver Comprobante</a>
                  : <span className="text-muted-foreground">No disponible</span>
                }
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No hay inscripciones para mostrar.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RegistrationsTable;