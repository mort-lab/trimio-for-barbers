"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Pencil, Trash2, Loader2 } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface Service {
  id: string;
  serviceName: string;
  description: string;
  price: number;
  duration: number;
  barbershopId: string;
  category?: string;
  imageUrl?: string;
  isActive: boolean;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await api.fetchWithAuth<Service[]>("/services");
      setServices(data);
    } catch (err) {
      setError("Error fetching services");
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to fetch services. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const serviceData = Object.fromEntries(formData);

    try {
      await api.fetchWithAuth("/services", {
        method: "POST",
        body: JSON.stringify(serviceData),
      });

      await fetchServices();
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Service created successfully!",
      });
    } catch (err) {
      console.error("Error creating service:", err);
      toast({
        title: "Error",
        description: "Failed to create service. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentService) return;

    const formData = new FormData(event.currentTarget);
    const serviceData = Object.fromEntries(formData);

    try {
      await api.fetchWithAuth(`/services/${currentService.id}`, {
        method: "PUT",
        body: JSON.stringify(serviceData),
      });

      await fetchServices();
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Service updated successfully!",
      });
    } catch (err) {
      console.error("Error updating service:", err);
      toast({
        title: "Error",
        description: "Failed to update service. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await api.fetchWithAuth(`/services/${id}`, {
        method: "DELETE",
      });

      await fetchServices();
      toast({
        title: "Success",
        description: "Service deleted successfully!",
      });
    } catch (err) {
      console.error("Error deleting service:", err);
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      });
    }
  };

  const ServiceForm = ({
    service,
    onSubmit,
  }: {
    service?: Service;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="serviceName">Service Name</Label>
        <Input
          id="serviceName"
          name="serviceName"
          defaultValue={service?.serviceName}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={service?.description}
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          defaultValue={service?.price}
          required
        />
      </div>
      <div>
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input
          id="duration"
          name="duration"
          type="number"
          defaultValue={service?.duration}
          required
        />
      </div>
      <div>
        <Label htmlFor="barbershopId">Barbershop ID</Label>
        <Input
          id="barbershopId"
          name="barbershopId"
          defaultValue={service?.barbershopId}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" defaultValue={service?.category} />
      </div>
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" name="imageUrl" defaultValue={service?.imageUrl} />
      </div>
      <div>
        <Label htmlFor="isActive">Active</Label>
        <Input
          id="isActive"
          name="isActive"
          type="checkbox"
          defaultChecked={service?.isActive}
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p>{error}</p>
          <Button onClick={fetchServices} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Service</DialogTitle>
              <DialogDescription>
                Enter the details for your new service.
              </DialogDescription>
            </DialogHeader>
            <ServiceForm onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">
                {service.serviceName}
              </TableCell>
              <TableCell>{service.description}</TableCell>
              <TableCell>${service.price.toFixed(2)}</TableCell>
              <TableCell>{service.duration} min</TableCell>
              <TableCell>{service.category || "N/A"}</TableCell>
              <TableCell>{service.isActive ? "Yes" : "No"}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => {
                        setCurrentService(service);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDelete(service.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update the details for your service.
            </DialogDescription>
          </DialogHeader>
          <ServiceForm
            service={currentService || undefined}
            onSubmit={handleEdit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
