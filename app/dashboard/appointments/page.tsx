"use client";

import React, { useState, useCallback } from "react";
import AppointmentsView from "@/components/appointments/AppointmentsView";
import CalendarView from "@/components/appointments/CalendarView";
import CreateAppointmentButton from "@/components/appointments/appointments/CreateAppointmentButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, List } from "lucide-react";

const Appointments = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("appointments");

  const handleAppointmentCreated = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-3xl font-bold">
            {activeTab === "appointments" ? "Appointments" : "Calendar"}
          </CardTitle>
          <CardDescription className="text-lg mt-1">
            Manage your barbershop {activeTab}
          </CardDescription>
        </div>
        <CreateAppointmentButton
          onAppointmentCreated={handleAppointmentCreated}
        />
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="appointments"
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="appointments">
              <List className="mr-2 h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </TabsTrigger>
          </TabsList>
          <TabsContent value="appointments" className="mt-6">
            <AppointmentsView key={refreshKey} />
          </TabsContent>
          <TabsContent value="calendar" className="mt-6">
            <CalendarView key={refreshKey} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Appointments;
