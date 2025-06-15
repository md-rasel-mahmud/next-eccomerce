"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Package, DollarSign, Eye } from "lucide-react";
import { products } from "@/data/products";
import {
  ColumnConfig,
  ReusableTable,
} from "@/components/common/table/ReusableTable";
import { OrderTypeWithId } from "@/lib/models/order/order.dto";
import useSWR from "swr";
import axiosRequest from "@/lib/axios";
import { useRouter } from "next/navigation";
import { cn, getCurrencySymbol, getOrderStatusBadgeClass } from "@/lib/utils";
import { getOrderStatusIcon } from "@/helpers/get-order-status-icon";
import { PaymentMethods } from "@/enums/PaymentMethods.enum";
import moment from "moment";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const AdminDashboard: React.FC = () => {
  const router = useRouter();

  const { data: orderList, isLoading: orderListLoading } = useSWR(
    `/order?page=1&limit=5=sortBy=createdAt&sortOrder=desc`,
    (url) => axiosRequest.get(url).then((res) => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Simulated data for the dashboard
  const stats = {
    totalRevenue: products.reduce((sum, product) => sum + product.price, 0),
    totalOrders: 24, // Mock data
    totalUsers: 18, // Mock data
    recentOrders: [
      {
        id: "ORD-001",
        customer: "John Doe",
        amount: 129.99,
        status: "delivered",
        date: "2025-05-18",
      },
      {
        id: "ORD-002",
        customer: "Jane Smith",
        amount: 84.5,
        status: "shipped",
        date: "2025-05-19",
      },
      {
        id: "ORD-003",
        customer: "Alex Johnson",
        amount: 56.75,
        status: "pending",
        date: "2025-05-20",
      },
      {
        id: "ORD-004",
        customer: "Sam Wilson",
        amount: 102.25,
        status: "pending",
        date: "2025-05-21",
      },
    ],
  };

  const columns: ColumnConfig<OrderTypeWithId>[] = [
    {
      header: "Order ID",
      accessor: (row) => <p className="font-semibold w-20">{row.orderId}</p>,
    },
    {
      header: "User",
      accessor: (row) => {
        return (
          <div>
            <p className="font-semibold">{row.fullName}</p>
            <p className="text-sm text-muted-foreground">{row.phone}</p>
            {
              // address
            }
            <small className="text-xs text-muted-foreground">
              {row.address}- {row.postalCode}, {row.district}, {row.division}
            </small>
          </div>
        );
      },
    },
    {
      header: "Total",
      accessor: (row) => (
        <div className="inline-flex items-center gap-1">
          <span>{getCurrencySymbol("BDT")}</span>{" "}
          <span>{row.totalAmount.toFixed(2)}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row) => (
        <div className="space-y-2 flex flex-col justify-center items-start gap-2">
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 text-xs rounded-full",
              getOrderStatusBadgeClass(row.status)
            )}
          >
            {getOrderStatusIcon(row.status)}
            {row.status}
          </span>

          <span
            className={cn(
              "inline-flex items-center px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-800"
            )}
          >
            {row.paymentMethod === PaymentMethods.COD
              ? "Cash on Delivery"
              : row.paymentMethod === PaymentMethods.BKASH
              ? "Bkash"
              : row.paymentMethod === PaymentMethods.BANK_TRANSFER
              ? "Bank Transfer"
              : "Unknown"}
          </span>
        </div>
      ),
    },
    {
      header: "Date",
      accessor: (row) => moment(row.createdAt).format("YYYY-MM-DD HH:mm A"),
    },

    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => {
                  router.push(`/order-view?id=${row._id}`);
                }}
              >
                <Eye />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View the order details</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <Package className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <User className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>

        <CardContent>
          <ReusableTable<OrderTypeWithId>
            className="shadow-none border"
            hasPagination={false}
            data={orderList?.data || []}
            columns={columns}
            pagination={orderList?.pagination}
            hasAction={false}
            isLoading={orderListLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
