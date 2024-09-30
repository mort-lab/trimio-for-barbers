"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog as DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Search, Scissors } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

interface BarberProfile {
  id: string;
  userId: string;
  barbershopId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Barbershop {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  additionalInfo?: string;
  barberProfiles: BarberProfile[];
}

export default function BarbershopManagement() {
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentBarbershop, setCurrentBarbershop] = useState<Barbershop | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    } else if (!authLoading && user) {
      fetchBarbershops();
    }
  }, [user, authLoading, router]);

  const fetchBarbershops = async () => {
    setIsLoading(true);
    try {
      const data = await api.fetchBarbershops();
      setBarbershops(data);
    } catch (err) {
      setError("Error fetching barbershops");
      toast({
        title: "Error",
        description: "Failed to fetch barbershops. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const barbershopData = {
      name: formData.get("name")?.toString() || "",
      address: formData.get("address")?.toString() || "",
      city: formData.get("city")?.toString() || "",
      state: formData.get("state")?.toString() || "",
      zipCode: formData.get("zipCode")?.toString() || "",
      additionalInfo: formData.get("additionalInfo")?.toString() || "",
    };

    if (!validateBarbershopData(barbershopData)) return;

    try {
      await api.createBarbershop(barbershopData);
      await fetchBarbershops();
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Barbershop created successfully!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create barbershop. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentBarbershop) return;

    const formData = new FormData(event.currentTarget);
    const barbershopData = Object.fromEntries(formData);

    if (!validateBarbershopData(barbershopData)) return;

    try {
      await api.updateBarbershop(currentBarbershop.id, barbershopData);
      await fetchBarbershops();
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Barbershop updated successfully!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update barbershop. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this barbershop?")) return;

    try {
      await api.deleteBarbershop(id);
      await fetchBarbershops();
      toast({
        title: "Success",
        description: "Barbershop deleted successfully!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete barbershop. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const data = await api.searchBarbershops(searchTerm);
      setBarbershops(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to search barbershops. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateBarbershopData = (data: any) => {
    if (
      data.name.length < 3 ||
      data.address.length < 5 ||
      data.city.length < 2 ||
      data.state.length < 2 ||
      data.zipCode.length < 5
    ) {
      toast({
        title: "Validation Error",
        description: "Please ensure all fields meet the required lengths.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const BarbershopForm = ({
    barbershop,
    onSubmit,
  }: {
    barbershop?: Barbershop;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={barbershop?.name} required />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          defaultValue={barbershop?.address}
          required
        />
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input id="city" name="city" defaultValue={barbershop?.city} required />
      </div>
      <div>
        <Label htmlFor="state">State</Label>
        <Input
          id="state"
          name="state"
          defaultValue={barbershop?.state}
          required
        />
      </div>
      <div>
        <Label htmlFor="zipCode">Zip Code</Label>
        <Input
          id="zipCode"
          name="zipCode"
          defaultValue={barbershop?.zipCode}
          required
        />
      </div>
      <div>
        <Label htmlFor="additionalInfo">Additional Info</Label>
        <Textarea
          id="additionalInfo"
          name="additionalInfo"
          defaultValue={barbershop?.additionalInfo}
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );

  if (authLoading || isLoading) {
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
          <Button onClick={fetchBarbershops} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Your Barbershops</h1>
      </div>
      <div className="flex justify-between mb-6">
        <div className="flex gap-2 w-1/2">
          <Input
            placeholder="Search barbershops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>
        <DialogRoot
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New Barbershop
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Barbershop</DialogTitle>
              <DialogDescription>
                Enter the details for your new barbershop.
              </DialogDescription>
            </DialogHeader>
            <BarbershopForm onSubmit={handleCreate} />
          </DialogContent>
        </DialogRoot>
      </div>
      {barbershops.length === 0 ? (
        <div className="text-center py-10">
          <Scissors className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Barbershops Yet</h2>
          <p className="text-gray-600 mb-4">
            You haven't added any barbershops. Create your first one to get
            started!
          </p>
          <DialogRoot
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Your First Barbershop
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Barbershop</DialogTitle>
                <DialogDescription>
                  Enter the details for your new barbershop.
                </DialogDescription>
              </DialogHeader>
              <BarbershopForm onSubmit={handleCreate} />
            </DialogContent>
          </DialogRoot>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Zip Code</TableHead>
              <TableHead>Account Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {barbershops.map((barbershop) => (
              <TableRow key={barbershop.id}>
                <TableCell className="font-medium">{barbershop.name}</TableCell>
                <TableCell>{barbershop.address}</TableCell>
                <TableCell>{barbershop.city}</TableCell>
                <TableCell>{barbershop.state}</TableCell>
                <TableCell>{barbershop.zipCode}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-primary text-primary-foreground"
                  >
                    {barbershop.barberProfiles[0]?.role || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <DialogRoot
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentBarbershop(barbershop)}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Barbershop</DialogTitle>
                          <DialogDescription>
                            Update the details for your barbershop.
                          </DialogDescription>
                        </DialogHeader>
                        <BarbershopForm
                          barbershop={currentBarbershop || undefined}
                          onSubmit={handleEdit}
                        />
                      </DialogContent>
                    </DialogRoot>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(barbershop.id)}
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
