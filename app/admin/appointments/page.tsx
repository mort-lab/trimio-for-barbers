"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AppointmentsPage = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Mock data for appointments
  const todaysAppointments = [
    { time: "09:00", client: "John Doe", service: "Haircut" },
    { time: "10:30", client: "Jane Smith", service: "Beard Trim" },
    { time: "14:00", client: "Mike Johnson", service: "Full Service" },
  ];

  const upcomingAppointments = [
    {
      date: "2024-10-27",
      time: "11:00",
      client: "Alice Brown",
      service: "Coloring",
    },
    {
      date: "2024-10-28",
      time: "13:30",
      client: "Bob Wilson",
      service: "Haircut & Beard",
    },
    {
      date: "2024-10-29",
      time: "15:00",
      client: "Charlie Davis",
      service: "Styling",
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Appointments</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Todays Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todaysAppointments.map((appointment, index) => (
                  <TableRow key={index}>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.client}</TableCell>
                    <TableCell>{appointment.service}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Client</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingAppointments.map((appointment, index) => (
                  <TableRow key={index}>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.client}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Appointment Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-2xl font-bold">15</p>
              <p className="text-sm text-muted-foreground">
                Total Appointments Today
              </p>
            </div>
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold">85%</p>
              <p className="text-sm text-muted-foreground">Booking Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Appointment Calendar</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button>New Appointment</Button>
      </div>
    </div>
  );
};

export default AppointmentsPage;
