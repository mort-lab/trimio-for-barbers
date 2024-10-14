"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BarbershopSettings from "@/components/settings/BarbershopSettings";
import UserSettings from "@/components/settings/UserSettings";

export default function Settings() {
  const [error, setError] = useState<string | null>(null);

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
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="user">
        <TabsList>
          <TabsTrigger value="user">User Settings</TabsTrigger>
          <TabsTrigger value="barbershop">Barbershop Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <UserSettings />
        </TabsContent>
        <TabsContent value="barbershop">
          <BarbershopSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
