"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, DollarSign, Users, Trash2, Edit, Plus } from "lucide-react";

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
  const [stats, setStats] = useState<DashboardStats>({
    appointmentsToday: 0,
    totalClients: 0,
    revenue: 0,
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    } else if (user) {
      fetchDashboardData();
    }
  }, [user, loading, router]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // In a real application, you would fetch this data from your API
      // const statsResponse = await fetch(`/api/dashboard/stats/${user.id}`);
      // const statsData = await statsResponse.json();
      // setStats(statsData);

      // const appointmentsResponse = await fetch(`/api/appointments/barber/${user.id}`);
      // const appointmentsData = await appointmentsResponse.json();
      // setAppointments(appointmentsData);

      // Placeholder data
      setStats({
        appointmentsToday: 8,
        totalClients: 120,
        revenue: 1500,
      });

      setAppointments([
        {
          id: 1,
          clientName: "John Doe",
          service: "Haircut",
          date: "2023-06-15",
          time: "14:00",
        },
        {
          id: 2,
          clientName: "Jane Smith",
          service: "Beard Trim",
          date: "2023-06-15",
          time: "15:30",
        },
        {
          id: 3,
          clientName: "Mike Johnson",
          service: "Hair Coloring",
          date: "2023-06-16",
          time: "10:00",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
    setIsLoading(false);
  };

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        // In a real application, you would call your API to delete the appointment
        // await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
        setAppointments(appointments.filter((app) => app.id !== id));
      } catch (error) {
        console.error("Failed to delete appointment:", error);
      }
    }
  };

  const handleSave = async (appointment: Appointment) => {
    try {
      // In a real application, you would call your API to update or create the appointment
      // const response = await fetch(`/api/appointments/${appointment.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(appointment),
      // });
      // const updatedAppointment = await response.json();

      // Placeholder update logic
      const updatedAppointments = appointments.map((app) =>
        app.id === appointment.id ? appointment : app
      );
      setAppointments(updatedAppointments);
      setIsEditDialogOpen(false);
      setIsNewDialogOpen(false);
    } catch (error) {
      console.error("Failed to save appointment:", error);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user.email}</h1>
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
            <CardTitle className="text-sm font-medium">Account Type</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{user.role}</div>
          </CardContent>
        </Card>
      </div>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Appointments</CardTitle>
          <Button onClick={() => setIsNewDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Appointment
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(appointment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(appointment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog
        open={isEditDialogOpen || isNewDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          setIsNewDialogOpen(open);
          if (!open) setSelectedAppointment(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditDialogOpen ? "Edit Appointment" : "New Appointment"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const appointment = {
                id: selectedAppointment?.id || Date.now(),
                clientName: formData.get("clientName") as string,
                service: formData.get("service") as string,
                date: formData.get("date") as string,
                time: formData.get("time") as string,
              };
              handleSave(appointment);
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientName" className="text-right">
                  Client Name
                </Label>
                <Input
                  id="clientName"
                  name="clientName"
                  defaultValue={selectedAppointment?.clientName}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service" className="text-right">
                  Service
                </Label>
                <Input
                  id="service"
                  name="service"
                  defaultValue={selectedAppointment?.service}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={selectedAppointment?.date}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  defaultValue={selectedAppointment?.time}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-muted-foreground">
          Account created: {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
