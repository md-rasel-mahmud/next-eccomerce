"use client";
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";
import Link from "next/link";

const UserLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-display font-semibold mb-8">
        Your Account
      </h1>

      <Tabs value={pathname} className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="/user" className="text-base">
            <Link href="/user" className="flex items-center">
              User Info
            </Link>
          </TabsTrigger>
          <TabsTrigger value="/user/orders" className="text-base">
            <Link href="/user/orders" className="flex items-center">
              Orders
            </Link>
          </TabsTrigger>
          {/* <TabsTrigger value="change-password" className="text-base">
            Change Password
          </TabsTrigger> */}
        </TabsList>

        {
          // Dashboard Tab
        }

        {children}
      </Tabs>
    </div>
  );
};

export default UserLayout;
