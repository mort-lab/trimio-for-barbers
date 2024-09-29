import React from "react";
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
import { Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Settings = () => {
  const activePlan = "Free";
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
  };
  const barbershop = {
    name: "Classic Cuts",
    address: "123 Main St, City, Country",
    phone: "+1 234 567 890",
  };
  const barbers = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Owner" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Barber" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "Barber",
    },
  ];

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
                      {activePlan}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    You are currently on the {activePlan} plan.
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
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Avatar</Button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user.email} />
                </div>
              </div>
              <Button>Update User Information</Button>
            </div>
          </section>

          <Separator />

          {/* Barbershop Information Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Barbershop Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="barbershop-name">Barbershop Name</Label>
                  <Input id="barbershop-name" value={barbershop.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barbershop-address">Address</Label>
                  <Input id="barbershop-address" value={barbershop.address} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barbershop-phone">Phone</Label>
                  <Input id="barbershop-phone" value={barbershop.phone} />
                </div>
              </div>
              <Button>Update Barbershop Information</Button>
            </div>
          </section>

          <Separator />

          {/* Barbers Table Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Barbers</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {barbers.map((barber) => (
                  <TableRow key={barber.id}>
                    <TableCell className="font-medium">{barber.name}</TableCell>
                    <TableCell>{barber.email}</TableCell>
                    <TableCell>{barber.role}</TableCell>
                    <TableCell className="text-right">
                      {barber.role !== "Owner" && (
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove barber</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <Button variant="outline">Add New Barber</Button>
            </div>
          </section>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Settings;
