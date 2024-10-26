import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Barbershop } from "@/types/barbershop";
import { Badge } from "@/components/ui/badge";

interface BarbershopsTableManagerProps {
  barbershops: Barbershop[];
  onSelectBarbershop: (barbershop: Barbershop) => void;
  onDeleteBarbershop: (barbershopId: string) => void;
}

export default function BarbershopsTableManager({
  barbershops,
  onSelectBarbershop,
  onDeleteBarbershop,
}: BarbershopsTableManagerProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Barber Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {barbershops.map((barbershop) => (
          <TableRow key={barbershop.barbershopId}>
            <TableCell>Martin Irurozki</TableCell>
            <TableCell>mirurozk@gmail.com</TableCell>
            <TableCell>
              <Badge>Accepted</Badge>
            </TableCell>
            <TableCell>
              <Badge>OWNER</Badge>
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectBarbershop(barbershop)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="ml-2"
                onClick={() => onDeleteBarbershop(barbershop.barbershopId)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
