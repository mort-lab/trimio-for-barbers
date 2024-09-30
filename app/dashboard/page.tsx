"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Users, Scissors, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Appointment = {
  id: number;
  clientName: string;
  service: string;
  date: string;
  time: string;
};

type DashboardStats = {
  appointmentsToday: number;
  totalClients: number;
  revenue: number;
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const activeBarbershop = useAuthStore((state) => state.activeBarbershop);
  const [stats, setStats] = useState<DashboardStats>({
    appointmentsToday: 0,
    totalClients: 0,
    revenue: 0,
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    } else if (user && activeBarbershop) {
      fetchDashboardData();
    }
  }, [user, loading, router, activeBarbershop]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // In a real application, you would fetch this data from your API
      // For now, we'll use placeholder data
      const statsData = await api.fetchWithAuth<DashboardStats>(
        `/barbershops/${activeBarbershop?.id}/stats`
      );
      setStats(statsData);

      const appointmentsData = await api.fetchWithAuth<Appointment[]>(
        `/barbershops/${activeBarbershop?.id}/appointments`
      );
      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
    setIsLoading(false);
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Scissors className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user?.email}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Appointments Today
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.appointmentsToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenue (This Month)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Barbershop
            </CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {activeBarbershop?.name || "Not selected"}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.clientName}</TableCell>
                <TableCell>{appointment.service}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    <Clock className="mr-2 h-4 w-4" />
                    Reschedule
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
