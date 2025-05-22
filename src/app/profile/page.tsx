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
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserDashboard } from "@/components/UserDashboard";
import { signOut, useSession } from "next-auth/react";

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  const { data } = useSession();
  const user = data?.user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mock API call to update profile
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });

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
                      value={user?.name}
                      disabled={true}
                      className={isEditing ? "border-organic-300" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      type="text"
                      disabled={true}
                      value={user?.phone}
                      className={isEditing ? "border-organic-300" : ""}
                    />
                  </div>

                  {isEditing && (
                    <div className="pt-4 flex gap-3">
                      <Button
                        type="submit"
                        className="bg-organic-500 hover:bg-organic-600"
                        disabled={false}
                      >
                        {false ? "Saving..." : "Save Changes"}
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
