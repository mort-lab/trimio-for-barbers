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
import { Trash2, Edit, Plus } from "lucide-react";

type Appointment = {
  id: number;
  clientName: string;
  service: string;
  date: string;
  time: string;
};

export default function Appointments() {
  const { user, loading } = useAuth();
  const router = useRouter();
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
      fetchAppointments();
    }
  }, [user, loading, router]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      // In a real application, you would fetch this data from your API
      // const response = await fetch(`/api/appointments/barber/${user.id}`);
      // const data = await response.json();
      // setAppointments(data);

      // Placeholder data
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
      console.error("Failed to fetch appointments:", error);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <Button onClick={() => setIsNewDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Appointment
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Appointments</CardTitle>
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
    </div>
  );
}
