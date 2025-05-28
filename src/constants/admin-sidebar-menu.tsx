import {
  LayoutDashboard,
  Package,
  PackageCheck,
  List,
  ChartBar,
} from "lucide-react";

export const adminSidebarMenu = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
  },
  {
    title: "Categories",
    path: "/admin/category",
    icon: <ChartBar className="mr-2 h-4 w-4" />,
  },
  {
    title: "Products",
    path: "/admin/products",
    icon: <Package className="mr-2 h-4 w-4" />,
  },
  {
    title: "Orders",
    path: "/admin/orders",
    icon: <PackageCheck className="mr-2 h-4 w-4" />,
  },
  { title: "Store", path: "/", icon: <List className="mr-2 h-4 w-4" /> },
];
