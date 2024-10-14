"use client";

import React from "react";
import AppointmentsView from "@/components/appointments/AppointmentsView";
import CalendarView from "@/components/appointments/CalendarView";
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
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Appointments</CardTitle>
        <CardDescription>Manage your barbershop appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="appointments" className="w-full">
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
          <TabsContent value="appointments">
            <AppointmentsView />
          </TabsContent>
          <TabsContent value="calendar">
            <CalendarView />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Appointments;
