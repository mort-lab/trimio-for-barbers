"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { Loader2, Plus, Search } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import useAuthStore from "@/store/authStore";

interface Service {
  id: string;
  serviceName: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  imageUrl: string;
  isActive: boolean;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { user } = useAuth();
  const activeBarbershop = useAuthStore((state) => state.activeBarbershop);

  useEffect(() => {
    if (!user) {
      router.push("/auth");
    } else if (activeBarbershop) {
      fetchServices();
    }
  }, [user, activeBarbershop, router]);

  const fetchServices = async () => {
    if (!activeBarbershop) return;
    setIsLoading(true);
    try {
      const data = await api.fetchWithAuth<Service[]>(
        `/services/barbershop/${activeBarbershop.id}`
      );
      setServices(data);
      setError(null);
    } catch (err) {
      setError("Error fetching services");
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
    if (!activeBarbershop) return;
    const formData = new FormData(event.currentTarget);
    const serviceData = {
      serviceName: formData.get("serviceName") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      duration: parseInt(formData.get("duration") as string),
      category: formData.get("category") as string,
      imageUrl: formData.get("imageUrl") as string,
      isActive: true,
      barbershopId: activeBarbershop.id,
    };

    try {
      await api.fetchWithAuth("/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });
      await fetchServices();
      setIsCreateDialogOpen(false);
      toast({ title: "Success", description: "Service created successfully!" });
    } catch (err) {
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
    const serviceData = {
      serviceName: formData.get("serviceName") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      duration: parseInt(formData.get("duration") as string),
      category: formData.get("category") as string,
      imageUrl: formData.get("imageUrl") as string,
      isActive: true,
    };

    try {
      await api.fetchWithAuth(`/services/${currentService.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });
      await fetchServices();
      setIsEditDialogOpen(false);
      toast({ title: "Success", description: "Service updated successfully!" });
    } catch (err) {
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
      await api.fetchWithAuth(`/services/${id}`, { method: "DELETE" });
      await fetchServices();
      toast({ title: "Success", description: "Service deleted successfully!" });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = () => {
    const filteredServices = services.filter((service) =>
      service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setServices(filteredServices);
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
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          defaultValue={service?.category}
          required
        />
      </div>
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" name="imageUrl" defaultValue={service?.imageUrl} />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (error) {
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
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          Services for {activeBarbershop?.name}
        </h1>
      </div>
      <div className="flex justify-between mb-6">
        <div className="flex gap-2 w-1/2">
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New Service
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
      {services.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">
            You don't have any services yet. Create a new one to get started!
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
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
                <TableCell>{service.category}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentService(service)}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
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
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(service.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
