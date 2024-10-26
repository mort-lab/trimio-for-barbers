import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useDropzone } from "react-dropzone";
import useAuthStore from "@/store/authStore";

interface CreateBarbershopFormProps {
  onCreateBarbershop: (newBarbershop: any) => void;
  existingBarbershops: boolean;
}

export default function CreateBarbershopForm({
  onCreateBarbershop,
  existingBarbershops,
}: CreateBarbershopFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newBarbershop, setNewBarbershop] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    countryCode: "+34", // Default country code
    additionalInfo: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const { createOrUpdateBarbershop } = useAuthStore();

  const onDrop = (acceptedFiles: File[]) => {
    setImages(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBarbershop((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateBarbershop = async () => {
    const formData = new FormData();
    Object.entries(newBarbershop).forEach(([key, value]) => {
      formData.append(key, value);
    });
    images.forEach((image) => {
      formData.append("barbershopImages", image);
    });

    try {
      const createdBarbershop = await createOrUpdateBarbershop(formData);
      onCreateBarbershop(createdBarbershop);
      setIsOpen(false);
      setNewBarbershop({
        name: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        countryCode: "+34",
        additionalInfo: "",
      });
      setImages([]);
    } catch (err: any) {
      console.error("Error creating barbershop:", err);
      // Handle error (e.g., show error message to user)
    }
  };

  const formContent = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCreateBarbershop();
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Barbershop Name</Label>
        <Input
          id="name"
          name="name"
          value={newBarbershop.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={newBarbershop.address}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={newBarbershop.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            value={newBarbershop.state}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={newBarbershop.zipCode}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={newBarbershop.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="additionalInfo">Additional Info</Label>
        <Input
          id="additionalInfo"
          name="additionalInfo"
          value={newBarbershop.additionalInfo}
          onChange={handleInputChange}
        />
      </div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some images here, or click to select files</p>
      </div>
      {images.length > 0 && (
        <div>
          <p>Selected images:</p>
          <ul>
            {images.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      <Button type="submit" className="w-full">
        Create Barbershop
      </Button>
    </form>
  );

  if (existingBarbershops) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New Barbershop
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Barbershop</DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Your First Barbershop</CardTitle>
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>
    );
  }
}
