"use client";

import { useEffect, useState } from "react";
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
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UserProfile {
  id: string;
  email: string;
  username: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

const UserSettings = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const router = useRouter();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const profileData = await fetchWithAuth<UserProfile>("/users/profile");
        setProfile(profileData);
        setEditedProfile({
          username: profileData.username,
          phone: profileData.phone,
        });
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Error fetching profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
    setShowUpdateButton(true);
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const updatedProfile = await fetchWithAuth("/users/update-profile", {
        method: "PUT",
        body: JSON.stringify(editedProfile),
      });
      setProfile(updatedProfile.user);
      setUser(updatedProfile.user);
      setShowUpdateButton(false);
      setError(null);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Error updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await fetchWithAuth("/users/delete-account", {
        method: "DELETE",
      });
      useAuthStore.getState().logout();
      router.push("/login");
    } catch (err: any) {
      console.error("Error deleting account:", err);
      setError(err.message || "Error deleting account");
    } finally {
      setIsDeleteDialogOpen(false);
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
    <>
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" value={profile.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={editedProfile.username || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={editedProfile.phone || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="createdAt">Created At</Label>
                <Input
                  id="createdAt"
                  name="createdAt"
                  value={new Date(profile.createdAt).toLocaleString()}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="updatedAt">Updated At</Label>
                <Input
                  id="updatedAt"
                  name="updatedAt"
                  value={new Date(profile.updatedAt).toLocaleString()}
                  disabled
                />
              </div>

              {showUpdateButton && (
                <Button onClick={handleUpdateProfile} disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
              )}
            </form>
            <div className="mt-6 justify-between flex">
              <Button className="bg-primary text-white">Change Password</Button>
              <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Are you sure you want to delete your account?
                    </DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      Delete Account
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default UserSettings;
