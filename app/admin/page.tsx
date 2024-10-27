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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BarbershopOverviewPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Mock data for quick stats
  const quickStats = [
    { title: "Total Appointments", value: "32", change: "+4%" },
    { title: "Revenue", value: "$1,240", change: "+10%" },
    { title: "New Clients", value: "8", change: "+2%" },
  ];

  // Mock data for recent activity
  const recentActivity = [
    { time: "09:00", action: "New appointment booked", client: "John Doe" },
    { time: "10:30", action: "Service completed", client: "Jane Smith" },
    { time: "11:45", action: "New client registered", client: "Mike Johnson" },
  ];

  // Mock data for upcoming appointments
  const upcomingAppointments = [
    { time: "14:00", client: "Alice Brown", service: "Haircut" },
    { time: "15:30", client: "Bob Wilson", service: "Beard Trim" },
    { time: "17:00", client: "Charlie Davis", service: "Full Service" },
  ];

  // Mock data for weekly revenue
  const weeklyRevenue = [
    { name: "Mon", revenue: 500 },
    { name: "Tue", revenue: 700 },
    { name: "Wed", revenue: 600 },
    { name: "Thu", revenue: 800 },
    { name: "Fri", revenue: 1000 },
    { name: "Sat", revenue: 1200 },
    { name: "Sun", revenue: 900 },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Barbershop Overview</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Client</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell>{activity.time}</TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell>{activity.client}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
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
                {upcomingAppointments.map((appointment, index) => (
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
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Weekly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-1">
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
      </div>
    </div>
  );
}
