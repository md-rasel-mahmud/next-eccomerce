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
import { TabsContent } from "@/components/ui/tabs";
import { signOut, useSession } from "next-auth/react";
import { Roles } from "@/enums/Roles.enum";

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  const { data } = useSession();
  const user = data?.user as unknown as {
    name: string;
    email: string;
    phone?: string;
    role: Roles;
    image?: string;
  };

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
    <>
      <TabsContent value="/user">
        <div className="bg-gradient-to-br w-full mb-4 from-organic-500 to-organic-600 text-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold">Welcome back, {user?.name}</h2>
          <p className="opacity-90 mt-1">
            Here&apos;s a summary of your account
          </p>
        </div>

        <Card className="w-full rounded-2xl border">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
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
                  <Label htmlFor="phone">Phone</Label>
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
            {/* {!isEditing && (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-organic-500 hover:bg-organic-600"
              >
                Edit Profile
              </Button>
            )} */}
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
    </>
  );
};

export default ProfilePage;
