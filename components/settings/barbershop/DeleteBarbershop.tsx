import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchWithAuth } from "@/lib/api";

interface DeleteBarbershopProps {
  barbershopId: string;
  onDeleteBarbershop: () => void;
}

export default function DeleteBarbershop({
  barbershopId,
  onDeleteBarbershop,
}: DeleteBarbershopProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteBarbershop = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await fetchWithAuth(`/barbershops/${barbershopId}`, {
        method: "DELETE",
      });
      onDeleteBarbershop();
      setIsOpen(false);
    } catch (err: any) {
      console.error("Error deleting barbershop:", err);
      setError(err.message || "Error deleting barbershop");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Barbershop</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this barbershop?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            barbershop and remove all associated data from our servers.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteBarbershop}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Barbershop"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
