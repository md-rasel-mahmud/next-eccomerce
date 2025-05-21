import AdminLayout from "@/components/layouts/AdminLayout";
import React, { FC } from "react";

const AdminLayoutPage: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <AdminLayout>{children}</AdminLayout>;
};

export default AdminLayoutPage;
