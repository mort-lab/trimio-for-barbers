"use client";

import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Service {
  serviceId: string;
  serviceName: string;
  price: number;
}

interface BarberProfile {
  userId: string;
  email: string;
  username: string;
  role: string;
}

interface CreateAppointmentButtonProps {
  onAppointmentCreated: () => void;
}

const CreateAppointmentButton: React.FC<CreateAppointmentButtonProps> = ({
  onAppointmentCreated,
}) => {
  const { activeBarbershop } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<BarberProfile[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isServicesLoading, setIsServicesLoading] = useState(false);
  const [isBarbersLoading, setIsBarbersLoading] = useState(false);

  useEffect(() => {
    if (activeBarbershop?.id && isOpen) {
      fetchServices();
      fetchBarbers();
    }
  }, [activeBarbershop, isOpen]);

  const fetchServices = async () => {
    if (!activeBarbershop?.id) return;
    setIsServicesLoading(true);
    try {
      const data = await fetchWithAuth<Service[]>(
        `/barbershops/${activeBarbershop.id}/services`
      );
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive",
      });
    } finally {
      setIsServicesLoading(false);
    }
  };

  const fetchBarbers = async () => {
    if (!activeBarbershop?.id) return;
    setIsBarbersLoading(true);
    try {
      const data = await fetchWithAuth<BarberProfile[]>(
        `/barbershops/${activeBarbershop.id}/barbers`
      );
      setBarbers(data);
    } catch (error) {
      console.error("Error fetching barbers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch barbers",
        variant: "destructive",
      });
    } finally {
      setIsBarbersLoading(false);
    }
  };

  const handleCreateAppointment = async () => {
    if (
      !activeBarbershop?.id ||
      !selectedDate ||
      !selectedTime ||
      !selectedService ||
      !selectedBarber
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(":");
      appointmentDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

      const appointmentData = {
        barbershopId: activeBarbershop.id,
        serviceIds: [selectedService],
        barberId: selectedBarber,
        appointmentDate: appointmentDateTime.toISOString(),
      };

      const response = await fetchWithAuth<{ appointmentId: string }>(
        "/appointments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(appointmentData),
        }
      );

      toast({
        title: "Success",
        description: `Appointment created successfully. ID: ${response.appointmentId}`,
      });
      setIsOpen(false);
      onAppointmentCreated();
      resetForm();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Error",
        description: "Failed to create appointment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedDate(new Date());
    setSelectedTime("");
    setSelectedService("");
    setSelectedBarber("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create Appointment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Appointment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service">Service</Label>
              <Select
                onValueChange={setSelectedService}
                value={selectedService}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {isServicesLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading services...
                    </SelectItem>
                  ) : services.length > 0 ? (
                    services.map((service) => (
                      <SelectItem
                        key={service.serviceId}
                        value={service.serviceId}
                      >
                        {service.serviceName} - ${service.price}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-services" disabled>
                      No services available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="barber">Barber</Label>
              <Select onValueChange={setSelectedBarber} value={selectedBarber}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a barber" />
                </SelectTrigger>
                <SelectContent>
                  {isBarbersLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading barbers...
                    </SelectItem>
                  ) : barbers.length > 0 ? (
                    barbers.map((barber) => (
                      <SelectItem key={barber.userId} value={barber.userId}>
                        {barber.username} ({barber.email})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-barbers" disabled>
                      No barbers available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleCreateAppointment}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Appointment"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppointmentButton;
