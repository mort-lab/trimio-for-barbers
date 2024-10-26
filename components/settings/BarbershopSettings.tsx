"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import UploadImages from "./barbershop/UploadImages";
import RequestAccessButton from "./barbershop/RequestAccessButton";
import EditActiveBarbershop from "./barbershop/EditActiveBarbershop";
import CreateBarbershopForm from "./barbershop/CreateBarbershopForm";
import BarbershopsTableManager from "./barbershop/BarbershopsTableManager";
import DeleteBarbershop from "./barbershop/DeleteBarbershop";

interface Barbershop {
  barbershopId: string;
  barbershopName: string;
  barbershopAddress: string;
  barbershopCity: string;
  barbershopState: string;
  barbershopZipCode: string;
  barbershopLatitude: number;
  barbershopLongitude: number;
  userRole: string;
  barberProfiles: {
    userId: string;
    barberRole: string;
    barberName: string;
    userName: string;
  }[];
  barbershopImages: string[];
}

export default function BarbershopSettings() {
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [selectedBarbershop, setSelectedBarbershop] =
    useState<Barbershop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { activeBarbershop, setActiveBarbershop } = useAuthStore();

  useEffect(() => {
    const fetchBarbershops = async () => {
      setIsLoading(true);
      try {
        const data = await fetchWithAuth<Barbershop[]>("/barbershops");
        setBarbershops(data);
        if (activeBarbershop) {
          const active = data.find(
            (b) => b.barbershopId === activeBarbershop.id
          );
          setSelectedBarbershop(active || null);
        }
      } catch (err: any) {
        console.error("Error fetching barbershops:", err);
        setError(err.message || "Error fetching barbershop data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarbershops();
  }, [activeBarbershop]);

  const handleUpdateBarbershop = async (updatedBarbershop: Barbershop) => {
    setSelectedBarbershop(updatedBarbershop);
    setBarbershops((prev) =>
      prev.map((b) =>
        b.barbershopId === updatedBarbershop.barbershopId
          ? updatedBarbershop
          : b
      )
    );
    setActiveBarbershop({
      id: updatedBarbershop.barbershopId,
      name: updatedBarbershop.barbershopName,
      address: updatedBarbershop.barbershopAddress,
    });
  };

  const handleDeleteBarbershop = async () => {
    if (!selectedBarbershop) return;

    setBarbershops((prev) =>
      prev.filter((b) => b.barbershopId !== selectedBarbershop.barbershopId)
    );
    setSelectedBarbershop(null);
    setActiveBarbershop(null);
  };

  const handleCreateBarbershop = async (newBarbershop: Barbershop) => {
    setBarbershops((prev) => [...prev, newBarbershop]);
    setSelectedBarbershop(newBarbershop);
    setActiveBarbershop({
      id: newBarbershop.barbershopId,
      name: newBarbershop.barbershopName,
      address: newBarbershop.barbershopAddress,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-[1200px] mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Barbershop Settings</CardTitle>
        <CardDescription>Manage your barbershop information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <CreateBarbershopForm
            onCreateBarbershop={handleCreateBarbershop}
            existingBarbershops={barbershops.length > 0}
          />
          <RequestAccessButton />
        </div>

        {selectedBarbershop ? (
          <>
            <EditActiveBarbershop
              barbershop={selectedBarbershop}
              onUpdateBarbershop={handleUpdateBarbershop}
            />
            <div className="mt-8 space-y-6">
              <UploadImages
                barbershopId={selectedBarbershop.barbershopId}
                initialImages={selectedBarbershop.barbershopImages}
              />
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">
                Manage Your Barbershop
              </h3>
              <BarbershopsTableManager
                barbershops={[selectedBarbershop]}
                onSelectBarbershop={setSelectedBarbershop}
                onDeleteBarbershop={() => {}}
              />
            </div>
            <div className="mt-8">
              <DeleteBarbershop
                barbershopId={selectedBarbershop.barbershopId}
                onDeleteBarbershop={handleDeleteBarbershop}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">
              No Barbershop Selected
            </h3>
            <p className="text-gray-600 mb-6">
              Select a barbershop from the dropdown or create a new one to get
              started.
            </p>
            <CreateBarbershopForm
              onCreateBarbershop={handleCreateBarbershop}
              existingBarbershops={false}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
