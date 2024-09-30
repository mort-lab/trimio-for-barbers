"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import useAuthStore from "@/store/authStore";

interface Barbershop {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  additionalInfo?: string;
}

export default function Settings() {
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newBarbershop, setNewBarbershop] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    additionalInfo: "",
  });
  const { user, logout } = useAuth();
  const router = useRouter();
  const activeBarbershop = useAuthStore((state) => state.activeBarbershop);

  useEffect(() => {
    if (!user) {
      router.push("/auth");
    } else {
      fetchBarbershops();
    }
  }, [user, router]);

  const fetchBarbershops = async () => {
    setIsLoading(true);
    try {
      const data = await api.fetchWithAuth<Barbershop[]>("/barbershops");
      setBarbershops(data);
    } catch (error) {
      console.error("Error fetching barbershops:", error);
      toast({
        title: "Error",
        description: "Failed to fetch barbershops. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBarbershop = async () => {
    try {
      const createdBarbershop = await api.fetchWithAuth<Barbershop>(
        "/barbershops",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBarbershop),
        }
      );
      setBarbershops([...barbershops, createdBarbershop]);
      setNewBarbershop({
        name: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        additionalInfo: "",
      });
      toast({
        title: "Success",
        description: "Barbershop created successfully!",
      });
    } catch (error) {
      console.error("Error creating barbershop:", error);
      toast({
        title: "Error",
        description: "Failed to create barbershop. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBarbershop = async (id: string) => {
    if (!confirm("Are you sure you want to delete this barbershop?")) return;

    try {
      await api.fetchWithAuth(`/barbershops/${id}`, { method: "DELETE" });
      setBarbershops(barbershops.filter((shop) => shop.id !== id));
      toast({
        title: "Success",
        description: "Barbershop deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting barbershop:", error);
      toast({
        title: "Error",
        description: "Failed to delete barbershop. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUserInfo = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    };

    try {
      await api.fetchWithAuth("/users/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      toast({
        title: "Success",
        description: "User information updated successfully!",
      });
    } catch (error) {
      console.error("Error updating user information:", error);
      toast({
        title: "Error",
        description: "Failed to update user information. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-12">
          {/* Plan Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Plan</h2>
            <div className="bg-card text-card-foreground rounded-lg p-6 shadow">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-medium">
                    Current Plan:{" "}
                    <Badge className="ml-2 bg-primary text-primary-foreground">
                      Free
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    You are currently on the Free plan.
                  </p>
                </div>
                <Button variant="outline">Upgrade to Pro</Button>
              </div>
            </div>
          </section>

          <Separator />

          {/* User Information Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">User Information</h2>
            <form onSubmit={handleUpdateUserInfo} className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt={user?.email}
                  />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" type="button">
                  Change Avatar
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={user?.email?.split("@")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user?.email}
                  />
                </div>
              </div>
              <Button type="submit">Update User Information</Button>
            </form>
          </section>

          <Separator />

          {/* Barbershops Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Barbershops</h2>
            {barbershops.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg mb-4">
                  You don't have any barbershops yet.
                </p>
                <div className="space-x-4">
                  <Button variant="outline">
                    Request Access to Barbershop
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Create Barbershop</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Barbershop</DialogTitle>
                        <DialogDescription>
                          Enter the details of your new barbershop.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            value={newBarbershop.name}
                            onChange={(e) =>
                              setNewBarbershop({
                                ...newBarbershop,
                                name: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="address" className="text-right">
                            Address
                          </Label>
                          <Input
                            id="address"
                            value={newBarbershop.address}
                            onChange={(e) =>
                              setNewBarbershop({
                                ...newBarbershop,
                                address: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="city" className="text-right">
                            City
                          </Label>
                          <Input
                            id="city"
                            value={newBarbershop.city}
                            onChange={(e) =>
                              setNewBarbershop({
                                ...newBarbershop,
                                city: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="state" className="text-right">
                            State
                          </Label>
                          <Input
                            id="state"
                            value={newBarbershop.state}
                            onChange={(e) =>
                              setNewBarbershop({
                                ...newBarbershop,
                                state: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="zipCode" className="text-right">
                            Zip Code
                          </Label>
                          <Input
                            id="zipCode"
                            value={newBarbershop.zipCode}
                            onChange={(e) =>
                              setNewBarbershop({
                                ...newBarbershop,
                                zipCode: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleCreateBarbershop}>
                          Create Barbershop
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {barbershops.map((shop) => (
                    <TableRow key={shop.id}>
                      <TableCell className="font-medium">{shop.name}</TableCell>
                      <TableCell>{shop.address}</TableCell>
                      <TableCell>{shop.city}</TableCell>
                      <TableCell>{shop.state}</TableCell>
                      <TableCell>{shop.zipCode}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBarbershop(shop.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete barbershop</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className="mt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add New Barbershop
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Barbershop</DialogTitle>
                    <DialogDescription>
                      Enter the details of your new barbershop.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newBarbershop.name}
                        onChange={(e) =>
                          setNewBarbershop({
                            ...newBarbershop,
                            name: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="address" className="text-right">
                        Address
                      </Label>
                      <Input
                        id="address"
                        value={newBarbershop.address}
                        onChange={(e) =>
                          setNewBarbershop({
                            ...newBarbershop,
                            address: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="city" className="text-right">
                        City
                      </Label>
                      <Input
                        id="city"
                        value={newBarbershop.city}
                        onChange={(e) =>
                          setNewBarbershop({
                            ...newBarbershop,
                            city: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="state" className="text-right">
                        State
                      </Label>
                      <Input
                        id="state"
                        value={newBarbershop.state}
                        onChange={(e) =>
                          setNewBarbershop({
                            ...newBarbershop,
                            state: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="zipCode" className="text-right">
                        Zip Code
                      </Label>
                      <Input
                        id="zipCode"
                        value={newBarbershop.zipCode}
                        onChange={(e) =>
                          setNewBarbershop({
                            ...newBarbershop,
                            zipCode: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateBarbershop}>
                      Create Barbershop
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </section>
        </div>
      </div>
    </ScrollArea>
  );
}
