import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchWithAuth } from "@/lib/api";

export default function RequestAccessButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [requestAccessBarbershopId, setRequestAccessBarbershopId] =
    useState("");

  const handleRequestAccess = async () => {
    try {
      await fetchWithAuth("/barbershops/access-request", {
        method: "POST",
        body: JSON.stringify({ barbershopId: requestAccessBarbershopId }),
      });
      setIsOpen(false);
      setRequestAccessBarbershopId("");
      // Optionally, show a success message
    } catch (err: any) {
      console.error("Error requesting access:", err);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Request Access to Barbershop
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Access to Barbershop</DialogTitle>
            <DialogDescription>
              Enter the ID of the barbershop you want to request access to.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="requestAccessBarbershopId">
                Barbershop owner email
              </Label>
              <Input
                id="requestAccessBarbershopId"
                value={requestAccessBarbershopId}
                onChange={(e) => setRequestAccessBarbershopId(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestAccess}>Request Access</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
