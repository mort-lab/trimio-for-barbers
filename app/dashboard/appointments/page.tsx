"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Search, Calendar as CalendarIcon } from "lucide-react";

interface Appointment {
  id: string;
  clientId: string;
  barberProfileId: string;
  appointmentDate: string;
  status: string;
  barbershopId: string;
  client: {
    id: string;
    email: string;
  };
  barberProfile: {
    id: string;
    user: {
      email: string;
    };
  };
  services: {
    id: string;
    appointmentId: string;
    serviceId: string;
    service: {
      id: string;
      serviceName: string;
      description: string;
      price: number;
      duration: number;
      category: string;
      imageUrl: string;
      isActive: boolean;
    };
  }[];
  barbershop: {
    id: string;
    name: string;
  };
}

interface Service {
  id: string;
  serviceName: string;
  price: number;
  duration: number;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const router = useRouter();
  const { user } = useAuth();
  const activeBarbershop = useAuthStore((state) => state.activeBarbershop);

  useEffect(() => {
    if (!user) {
      router.push("/auth");
    } else if (activeBarbershop) {
      fetchAppointments();
      fetchServices();
    }
  }, [user, activeBarbershop, router, page]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await api.fetchWithAuth<Appointment[]>(
        `/appointments/barbershop/${activeBarbershop?.id}?date=${format(
          new Date(),
          "yyyy-MM-dd"
        )}&page=${page}&limit=${limit}`
      );
      setAppointments(data);
      setError(null);
    } catch (err) {
      setError("Error fetching appointments");
      toast({
        title: "Error",
        description: "Failed to fetch appointments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const data = await api.fetchWithAuth<Service[]>(
        `/services/barbershop/${activeBarbershop?.id}`
      );
      setServices(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch services. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateAppointment = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!selectedDate || selectedServices.length === 0) {
      toast({
        title: "Error",
        description: "Please select a date and at least one service.",
        variant: "destructive",
      });
      return;
    }

    const appointmentData = {
      barberId: user?.id,
      serviceIds: selectedServices,
      barbershopId: activeBarbershop?.id,
      appointmentDate: selectedDate.toISOString(),
    };

    try {
      await api.fetchWithAuth("/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });
      await fetchAppointments();
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Appointment created successfully!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAppointment = async (id: string, status: string) => {
    try {
      await api.fetchWithAuth(`/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await fetchAppointments();
      toast({
        title: "Success",
        description: "Appointment updated successfully!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;

    try {
      await api.fetchWithAuth(`/appointments/${id}`, { method: "DELETE" });
      await fetchAppointments();
      toast({
        title: "Success",
        description: "Appointment deleted successfully!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p>{error}</p>
          <Button onClick={fetchAppointments} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Appointments for {activeBarbershop?.name}
        </h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Appointment</DialogTitle>
              <DialogDescription>
                Enter the details for the new appointment.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
              <div>
                <Label htmlFor="services">Services</Label>
                <Select
                  onValueChange={(value) =>
                    setSelectedServices([...selectedServices, value])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select services" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.serviceName} - ${service.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Selected Services</Label>
                <ul>
                  {selectedServices.map((serviceId) => {
                    const service = services.find((s) => s.id === serviceId);
                    return (
                      <li
                        key={serviceId}
                        className="flex justify-between items-center"
                      >
                        <span>
                          {service?.serviceName} - ${service?.price}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSelectedServices(
                              selectedServices.filter((id) => id !== serviceId)
                            )
                          }
                        >
                          Remove
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <Button type="submit">Create Appointment</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {appointments.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold mb-2">No Appointments</h2>
          <p className="text-gray-600 mb-4">
            There are no appointments scheduled for this barbershop.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Barber</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  {format(new Date(appointment.appointmentDate), "PPP")}
                </TableCell>
                <TableCell>{appointment.client.email}</TableCell>
                <TableCell>{appointment.barberProfile.user.email}</TableCell>
                <TableCell>
                  {appointment.services.map((service) => (
                    <div key={service.id}>
                      {service.service.serviceName} - ${service.service.price}
                    </div>
                  ))}
                </TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell>
                  <Select
                    onValueChange={(value) =>
                      handleUpdateAppointment(appointment.id, value)
                    }
                    defaultValue={appointment.status}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="ml-2"
                    onClick={() => handleDeleteAppointment(appointment.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="mt-4 flex justify-between">
        <Button
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => setPage(page + 1)}
          disabled={appointments.length < limit}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
