"use client";
//app/dashboard/services/[id]/edit/page.tsx

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EditService() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id;

  // In a real application, you would fetch the service data here
  const service = {
    id: serviceId,
    name: "Haircut",
    duration: "30",
    price: "30",
  };

  const handleCancel = () => {
    router.push("/dashboard/services");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement save logic here
    router.push("/dashboard/services");
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Service</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={service.name} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input id="duration" defaultValue={service.duration} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" defaultValue={service.price} />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
