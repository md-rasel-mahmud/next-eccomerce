"use client";
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminSidebarMenu } from "@/constants/admin-sidebar-menu";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 bg-green-600 text-white">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>

        <nav className="p-4">
          <ul>
            {adminSidebarMenu.map((item) => (
              <li key={item.path} className="mb-2">
                <Link
                  href={item.path}
                  className={cn(
                    "flex items-center p-2 rounded-md hover:bg-green-50 transition-colors",
                    pathname === item.path && "bg-green-100 text-green-700"
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
