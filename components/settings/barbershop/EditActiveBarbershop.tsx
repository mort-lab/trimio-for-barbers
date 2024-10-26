import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { fetchWithAuth } from "@/lib/api";

interface Barbershop {
  barbershopId: string;
  barbershopName: string;
  barbershopAddress: string;
  barbershopCity: string;
  barbershopState: string;
  barbershopZipCode: string;
}

interface EditActiveBarbershopProps {
  barbershop: Barbershop;
  onUpdateBarbershop: (updatedBarbershop: Barbershop) => void;
}

export default function EditActiveBarbershop({
  barbershop,
  onUpdateBarbershop,
}: EditActiveBarbershopProps) {
  const [editedBarbershop, setEditedBarbershop] =
    useState<Barbershop>(barbershop);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedBarbershop((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateBarbershop = async () => {
    setIsLoading(true);
    try {
      const updatedBarbershop = await fetchWithAuth(
        `/barbershops/${barbershop.barbershopId}`,
        {
          method: "PUT",
          body: JSON.stringify(editedBarbershop),
        }
      );
      onUpdateBarbershop(updatedBarbershop);
    } catch (err: any) {
      console.error("Error updating barbershop:", err);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-auto mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Barbershop Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="barbershopName">Barbershop Name</Label>
              <Input
                id="barbershopName"
                name="barbershopName"
                value={editedBarbershop.barbershopName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barbershopAddress">Barbershop Adress</Label>
              <Input
                id="barbershopAddress"
                name="barbershopAddress"
                value={editedBarbershop.barbershopAddress}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="barbershopCity">City</Label>
              <Input
                id="barbershopCity"
                name="barbershopCity"
                value={editedBarbershop.barbershopCity}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barbershopState">State</Label>
              <Input
                id="barbershopState"
                name="barbershopState"
                value={editedBarbershop.barbershopState}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barbershopZipCode">Zip Code</Label>
              <Input
                id="barbershopZipCode"
                name="barbershopZipCode"
                value={editedBarbershop.barbershopZipCode}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barbershopAddress">Phone Number</Label>
              <Input
                id="barbershopAddress"
                name="barbershopAddress"
                value="223444422"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <Button
            type="button"
            className="w-full"
            onClick={handleUpdateBarbershop}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Save Barbershop Details"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
