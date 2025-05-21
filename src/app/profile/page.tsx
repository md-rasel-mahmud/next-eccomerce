"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { User } from "@/models/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserDashboard } from "@/components/UserDashboard";
import { useRouter } from "next/navigation";

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock API call to update profile
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update user data in localStorage (in a real app, this would be an API call)
      const updatedUser: User = {
        ...user,
        name,
        email,
        phone,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });

      setIsEditing(false);
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "There was an error updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-display font-semibold mb-8">
        Your Account
      </h1>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="dashboard" className="text-base">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="profile" className="text-base">
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="animate-slide-in">
          <UserDashboard />
        </TabsContent>

        <TabsContent value="profile" className="animate-slide-in">
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing}
                      className={isEditing ? "border-organic-300" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      className={isEditing ? "border-organic-300" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      value={phone || ""}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                      className={isEditing ? "border-organic-300" : ""}
                    />
                  </div>

                  {isEditing && (
                    <div className="pt-4 flex gap-3">
                      <Button
                        type="submit"
                        className="bg-organic-500 hover:bg-organic-600"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              {!isEditing && (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-organic-500 hover:bg-organic-600"
                >
                  Edit Profile
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                Logout
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
