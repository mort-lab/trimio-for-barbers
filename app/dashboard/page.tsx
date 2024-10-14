"use client";

import { useState } from "react";
import { CalendarIcon, FilterIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const weeklyCustomerData = [
  { name: "Mon", customers: 20 },
  { name: "Tue", customers: 30 },
  { name: "Wed", customers: 25 },
  { name: "Thu", customers: 40 },
  { name: "Fri", customers: 45 },
  { name: "Sat", customers: 50 },
  { name: "Sun", customers: 35 },
];

const recurrentCustomersData = [
  { month: "Jan", customers: 50 },
  { month: "Feb", customers: 60 },
  { month: "Mar", customers: 70 },
  { month: "Apr", customers: 55 },
  { month: "May", customers: 65 },
  { month: "Jun", customers: 75 },
];

export default function Dashboard() {
  const [appointments] = useState([
    {
      customer: "John Doe",
      barber: "Adam",
      amount: 50,
      duration: "30m",
      services: "Haircut",
      paid: true,
      hour: "09:00",
    },
    {
      customer: "Jane Smith",
      barber: "Eve",
      amount: 75,
      duration: "45m",
      services: "Haircut, Beard Trim",
      paid: false,
      hour: "10:00",
    },
    {
      customer: "Bob Johnson",
      barber: "Adam",
      amount: 60,
      duration: "40m",
      services: "Haircut",
      paid: true,
      hour: "11:00",
    },
    {
      customer: "Alice Brown",
      barber: "Eve",
      amount: 90,
      duration: "60m",
      services: "Haircut, Color",
      paid: true,
      hour: "13:00",
    },
    {
      customer: "Charlie Davis",
      barber: "Adam",
      amount: 55,
      duration: "35m",
      services: "Beard Trim",
      paid: false,
      hour: "14:00",
    },
  ]);

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <h1 className="text-3xl font-bold">Welcome back</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,329</div>
            <p className="text-xs text-muted-foreground">+25% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$14,321</div>
            <p className="text-xs text-muted-foreground">
              +225% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Appointments Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21</div>
            <p className="text-xs text-muted-foreground">
              +4 more than yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline">
          <CalendarIcon className="mr-2 h-4 w-4" /> Pick a date
        </Button>
        <div>
          <Button variant="outline" className="mr-2">
            Open Calendar
          </Button>
          <Button variant="outline">
            <FilterIcon className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todays Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Barber</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Paid?</TableHead>
                <TableHead>Hour</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment, index) => (
                <TableRow key={index}>
                  <TableCell>{appointment.customer}</TableCell>
                  <TableCell>{appointment.barber}</TableCell>
                  <TableCell>${appointment.amount}</TableCell>
                  <TableCell>{appointment.duration}</TableCell>
                  <TableCell>{appointment.services}</TableCell>
                  <TableCell>{appointment.paid ? "✅" : "❌"}</TableCell>
                  <TableCell>{appointment.hour}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Customer Report</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                customers: { label: "Customers", color: "hsl(var(--chart-1))" },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyCustomerData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="customers"
                    stroke="var(--color-customers)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-2 text-sm text-muted-foreground">
              +92 New Customers
              <br />
              +22 New Recurrent Customers
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recurrent Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                customers: { label: "Customers", color: "hsl(var(--chart-1))" },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recurrentCustomersData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="customers" fill="var(--color-customers)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Button className="w-full">See Full Analytics</Button>
    </div>
  );
}
