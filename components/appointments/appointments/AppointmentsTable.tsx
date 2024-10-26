"use client";

import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { format, addDays, isValid } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Appointment {
  appointmentId: string;
  barbershopId: string;
  barbershopName: string;
  barberId: string;
  barberEmail: string;
  customerId: string | null;
  clientId: string;
  appointmentDate: string;
  totalAppointmentPrice: number;
  status: string;
  services: {
    serviceId: string;
    serviceName: string;
    price: number;
  }[];
}

const AppointmentDetailModal: React.FC<{ appointment: Appointment }> = ({
  appointment,
}) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" size="sm">
        View Details
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[700px]">
      <DialogHeader>
        <DialogTitle>Appointment Details</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Date & Time</h3>
          <p>{format(new Date(appointment.appointmentDate), "PPpp")}</p>
        </div>
        <div>
          <h3 className="font-semibold">Status</h3>
          <p>{appointment.status}</p>
        </div>
        <div>
          <h3 className="font-semibold">Barber</h3>
          <p>{appointment.barberEmail}</p>
        </div>
        <div>
          <h3 className="font-semibold">Client ID</h3>
          <p>{appointment.clientId}</p>
        </div>
        <div className="sm:col-span-2">
          <h3 className="font-semibold">Services</h3>
          <ul className="list-disc pl-5">
            {appointment.services.map((service) => (
              <li key={service.serviceId}>
                {service.serviceName} - ${service.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Total Price</h3>
          <p>${appointment.totalAppointmentPrice.toFixed(2)}</p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

const DatePickerWithRange = ({
  className,
  onDateChange,
}: {
  className?: string;
  onDateChange: (range: DateRange | undefined) => void;
}) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  React.useEffect(() => {
    if (date?.from && isValid(date.from) && date?.to && isValid(date.to)) {
      onDateChange(date);
    }
  }, [date, onDateChange]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const AppointmentsTable = () => {
  const { activeBarbershop } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedBarber, setSelectedBarber] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");

  useEffect(() => {
    if (activeBarbershop?.id) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [activeBarbershop]);

  useEffect(() => {
    filterAppointments();
  }, [appointments, dateRange, selectedBarber, selectedCustomer]);

  const fetchAppointments = async () => {
    if (!activeBarbershop?.id) {
      console.error("No active barbershop selected");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchWithAuth<Appointment[]>(
        `/appointments/barbershop/${activeBarbershop.id}`
      );
      const sortedAppointments = data.sort(
        (a, b) =>
          new Date(b.appointmentDate).getTime() -
          new Date(a.appointmentDate).getTime()
      );
      setAppointments(sortedAppointments);
      setFilteredAppointments(sortedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    if (dateRange?.from) {
      filtered = filtered.filter(
        (appointment) =>
          new Date(appointment.appointmentDate) >= dateRange.from!
      );
    }

    if (dateRange?.to) {
      filtered = filtered.filter(
        (appointment) => new Date(appointment.appointmentDate) <= dateRange.to!
      );
    }

    if (selectedBarber && selectedBarber !== "all") {
      filtered = filtered.filter(
        (appointment) => appointment.barberEmail === selectedBarber
      );
    }

    if (selectedCustomer && selectedCustomer !== "all") {
      filtered = filtered.filter(
        (appointment) => appointment.clientId === selectedCustomer
      );
    }

    setFilteredAppointments(filtered);
  };

  if (!activeBarbershop?.id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please select a barbershop to view appointments.</p>
        </CardContent>
      </Card>
    );
  }

  const uniqueBarbers = [
    "all",
    ...new Set(appointments.map((a) => a.barberEmail)),
  ];
  const uniqueCustomers = [
    "all",
    ...new Set(appointments.map((a) => a.clientId)),
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Appointments for {activeBarbershop.barbershopName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="date-range" className="mb-2 block">
                Date Range
              </Label>
              <DatePickerWithRange onDateChange={setDateRange} />
            </div>
            <div>
              <Label htmlFor="barber" className="mb-2 block">
                Barber
              </Label>
              <Select value={selectedBarber} onValueChange={setSelectedBarber}>
                <SelectTrigger id="barber" className="w-full">
                  <SelectValue placeholder="Select a barber" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueBarbers.map((barber) => (
                    <SelectItem key={barber} value={barber}>
                      {barber === "all" ? "All Barbers" : barber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="customer" className="mb-2 block">
                Customer
              </Label>
              <Select
                value={selectedCustomer}
                onValueChange={setSelectedCustomer}
              >
                <SelectTrigger id="customer" className="w-full">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCustomers.map((customer) => (
                    <SelectItem key={customer} value={customer}>
                      {customer === "all" ? "All Customers" : customer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg animate-pulse">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">
              No appointments found.
            </p>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Barber</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead className="text-right">Total Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.appointmentId}>
                    <TableCell className="font-medium">
                      {format(new Date(appointment.appointmentDate), "PP")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(appointment.appointmentDate), "p")}
                    </TableCell>
                    <TableCell>{appointment.barberEmail}</TableCell>
                    <TableCell>
                      {appointment.services
                        .map((s) => s.serviceName)
                        .join(", ")}
                    </TableCell>
                    <TableCell className="text-right">
                      ${appointment.totalAppointmentPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          appointment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <AppointmentDetailModal appointment={appointment} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentsTable;
