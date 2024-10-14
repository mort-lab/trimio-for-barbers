"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Upload, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Barbershop {
  barbershopId: string;
  barbershopName: string;
  barbershopAddress: string;
  barbershopCity: string;
  barbershopState: string;
  barbershopZipCode: string;
  barbershopLatitude: number;
  barbershopLongitude: number;
  userRole: string;
  barberProfiles: {
    userId: string;
    barberRole: string;
    barberName: string;
    userName: string;
  }[];
  barbershopImages: string[];
}

interface AccessRequest {
  accessRequestId: string;
  barberId: string;
  barberName: string;
  barberEmail: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

const BarbershopSettings = () => {
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [selectedBarbershop, setSelectedBarbershop] =
    useState<Barbershop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editedBarbershop, setEditedBarbershop] = useState<Partial<Barbershop>>(
    {}
  );
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBarbershop, setNewBarbershop] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
  });
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [isRequestAccessDialogOpen, setIsRequestAccessDialogOpen] =
    useState(false);
  const [requestAccessBarbershopId, setRequestAccessBarbershopId] =
    useState("");

  const router = useRouter();
  const { activeBarbershop, setActiveBarbershop } = useAuthStore();

  useEffect(() => {
    const fetchBarbershops = async () => {
      setIsLoading(true);
      try {
        const data = await fetchWithAuth<Barbershop[]>("/barbershops");
        setBarbershops(data);
        if (activeBarbershop) {
          const active = data.find(
            (b) => b.barbershopId === activeBarbershop.id
          );
          setSelectedBarbershop(active || null);
        }
      } catch (err: any) {
        console.error("Error fetching barbershops:", err);
        setError(err.message || "Error fetching barbershop data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarbershops();
  }, [activeBarbershop]);

  useEffect(() => {
    if (selectedBarbershop) {
      fetchAccessRequests(selectedBarbershop.barbershopId);
    }
  }, [selectedBarbershop]);

  const fetchAccessRequests = async (barbershopId: string) => {
    try {
      const data = await fetchWithAuth<AccessRequest[]>(
        `/barbershops/${barbershopId}/access-requests`
      );
      setAccessRequests(data);
    } catch (err: any) {
      console.error("Error fetching access requests:", err);
      setError(err.message || "Error fetching access requests");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedBarbershop((prev) => ({ ...prev, [name]: value }));
    setShowUpdateButton(true);
  };

  const handleUpdateBarbershop = async () => {
    if (!selectedBarbershop) return;

    setIsLoading(true);
    try {
      const updatedBarbershop = await fetchWithAuth(
        `/barbershops/${selectedBarbershop.barbershopId}`,
        {
          method: "PUT",
          body: JSON.stringify(editedBarbershop),
        }
      );
      setSelectedBarbershop(updatedBarbershop);
      setBarbershops((prev) =>
        prev.map((b) =>
          b.barbershopId === updatedBarbershop.barbershopId
            ? updatedBarbershop
            : b
        )
      );
      setActiveBarbershop({
        id: updatedBarbershop.barbershopId,
        name: updatedBarbershop.barbershopName,
        address: updatedBarbershop.barbershopAddress,
      });
      setShowUpdateButton(false);
      setError(null);
    } catch (err: any) {
      console.error("Error updating barbershop:", err);
      setError(err.message || "Error updating barbershop");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBarbershop = async () => {
    if (!selectedBarbershop) return;

    try {
      await fetchWithAuth(`/barbershops/${selectedBarbershop.barbershopId}`, {
        method: "DELETE",
      });
      setBarbershops((prev) =>
        prev.filter((b) => b.barbershopId !== selectedBarbershop.barbershopId)
      );
      setSelectedBarbershop(null);
      setActiveBarbershop(null);
    } catch (err: any) {
      console.error("Error deleting barbershop:", err);
      setError(err.message || "Error deleting barbershop");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCreateBarbershop = async () => {
    setIsLoading(true);
    try {
      const createdBarbershop = await fetchWithAuth("/barbershops", {
        method: "POST",
        body: JSON.stringify(newBarbershop),
      });
      setBarbershops((prev) => [...prev, createdBarbershop]);
      setSelectedBarbershop(createdBarbershop);
      setActiveBarbershop({
        id: createdBarbershop.barbershopId,
        name: createdBarbershop.barbershopName,
        address: createdBarbershop.barbershopAddress,
      });
      setIsCreateDialogOpen(false);
      setNewBarbershop({
        name: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
      });
    } catch (err: any) {
      console.error("Error creating barbershop:", err);
      setError(err.message || "Error creating barbershop");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAccess = async () => {
    try {
      await fetchWithAuth("/barbershops/access-request", {
        method: "POST",
        body: JSON.stringify({ barbershopId: requestAccessBarbershopId }),
      });
      setIsRequestAccessDialogOpen(false);
      setError(null);
      // Optionally, you can show a success message here
    } catch (err: any) {
      console.error("Error requesting access:", err);
      setError(err.message || "Error requesting access");
    }
  };

  const handleUpdateAccessRequest = async (
    accessRequestId: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      await fetchWithAuth(`/barbershops/access-request/${accessRequestId}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      // Refresh access requests
      if (selectedBarbershop) {
        fetchAccessRequests(selectedBarbershop.barbershopId);
      }
    } catch (err: any) {
      console.error("Error updating access request:", err);
      setError(err.message || "Error updating access request");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Barbershop Settings</CardTitle>
        <CardDescription>Manage your barbershop information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create New Barbershop
          </Button>
          <Button onClick={() => setIsRequestAccessDialogOpen(true)}>
            Request Access to Barbershop
          </Button>
        </div>

        {selectedBarbershop ? (
          <>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="barbershopName">Barbershop Name</Label>
                <Input
                  id="barbershopName"
                  name="barbershopName"
                  value={
                    editedBarbershop.barbershopName ||
                    selectedBarbershop.barbershopName
                  }
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barbershopAddress">Address</Label>
                <Input
                  id="barbershopAddress"
                  name="barbershopAddress"
                  value={
                    editedBarbershop.barbershopAddress ||
                    selectedBarbershop.barbershopAddress
                  }
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barbershopCity">City</Label>
                <Input
                  id="barbershopCity"
                  name="barbershopCity"
                  value={
                    editedBarbershop.barbershopCity ||
                    selectedBarbershop.barbershopCity
                  }
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barbershopState">State</Label>
                <Input
                  id="barbershopState"
                  name="barbershopState"
                  value={
                    editedBarbershop.barbershopState ||
                    selectedBarbershop.barbershopState
                  }
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barbershopZipCode">Zip Code</Label>
                <Input
                  id="barbershopZipCode"
                  name="barbershopZipCode"
                  value={
                    editedBarbershop.barbershopZipCode ||
                    selectedBarbershop.barbershopZipCode
                  }
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
            <div className="mt-8 space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-1 text-sm text-gray-600">Upload Images</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {selectedBarbershop.barbershopImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Barbershop image ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                ))}
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">
                Manage Your Barbershop
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Barbers</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedBarbershop.barberProfiles.map((barber) => (
                    <TableRow key={barber.userId}>
                      <TableCell>{barber.barberName}</TableCell>
                      <TableCell>{barber.barberRole}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Access Requests</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Barber Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessRequests.map((request) => (
                    <TableRow key={request.accessRequestId}>
                      <TableCell>{request.barberName}</TableCell>
                      <TableCell>{request.barberEmail}</TableCell>
                      <TableCell>{request.status}</TableCell>
                      <TableCell>
                        {request.status === "PENDING" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mr-2"
                              onClick={() =>
                                handleUpdateAccessRequest(
                                  request.accessRequestId,
                                  "APPROVED"
                                )
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateAccessRequest(
                                  request.accessRequestId,
                                  "REJECTED"
                                )
                              }
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {showUpdateButton && (
              <Button
                onClick={handleUpdateBarbershop}
                disabled={isLoading}
                className="mt-6"
              >
                {isLoading ? "Updating..." : "Update Barbershop"}
              </Button>
            )}
            <div className="mt-8">
              <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete Barbershop</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Are you sure you want to delete this barbershop?
                    </DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your barbershop and remove all associated data from our
                      servers.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteBarbershop}
                    >
                      Delete Barbershop
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">
              No Barbershop Selected
            </h3>
            <p className="text-gray-600 mb-6">
              Select a barbershop from the dropdown or create a new one to get
              started.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create New Barbershop
            </Button>
          </div>
        )}

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Barbershop</DialogTitle>
              <DialogDescription>
                Enter the details for your new barbershop.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newBarbershopName">Barbershop Name</Label>
                <Input
                  id="newBarbershopName"
                  value={newBarbershop.name}
                  onChange={(e) =>
                    setNewBarbershop({ ...newBarbershop, name: e.target.value })
                  }
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newBarbershopAddress">Address</Label>
                <Input
                  id="newBarbershopAddress"
                  value={newBarbershop.address}
                  onChange={(e) =>
                    setNewBarbershop({
                      ...newBarbershop,
                      address: e.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newBarbershopCity">City</Label>
                <Input
                  id="newBarbershopCity"
                  value={newBarbershop.city}
                  onChange={(e) =>
                    setNewBarbershop({ ...newBarbershop, city: e.target.value })
                  }
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newBarbershopState">State</Label>
                <Input
                  id="newBarbershopState"
                  value={newBarbershop.state}
                  onChange={(e) =>
                    setNewBarbershop({
                      ...newBarbershop,
                      state: e.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newBarbershopZipCode">Zip Code</Label>
                <Input
                  id="newBarbershopZipCode"
                  value={newBarbershop.zipCode}
                  onChange={(e) =>
                    setNewBarbershop({
                      ...newBarbershop,
                      zipCode: e.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newBarbershopPhone">Phone Number</Label>
                <Input
                  id="newBarbershopPhone"
                  value={newBarbershop.phoneNumber}
                  onChange={(e) =>
                    setNewBarbershop({
                      ...newBarbershop,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateBarbershop}>
                Create Barbershop
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isRequestAccessDialogOpen}
          onOpenChange={setIsRequestAccessDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Access to Barbershop</DialogTitle>
              <DialogDescription>
                Enter the ID of the barbershop you want to request access to.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requestAccessBarbershopId">Barbershop ID</Label>
                <Input
                  id="requestAccessBarbershopId"
                  value={requestAccessBarbershopId}
                  onChange={(e) => setRequestAccessBarbershopId(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsRequestAccessDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleRequestAccess}>Request Access</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BarbershopSettings;
