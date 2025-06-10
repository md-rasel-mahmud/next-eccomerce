"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { Package, PackageCheck, PackageX } from "lucide-react";

const AdminOrders: React.FC = () => {
  // Mock orders data
  const initialOrders: Order[] = [
    {
      id: "ORD-001",
      userId: "user1",
      items: [
        {
          product: "1",
          productName: "Khejurer Gur (Date Molasses)",
          quantity: 2,
          price: 12.99,
        },
        {
          product: "2",
          productName: "Organic Honey",
          quantity: 1,
          price: 18.99,
        },
      ],
      totalAmount: 44.97,
      shippingAddress: {
        street: "123 Green St",
        city: "Eco City",
        state: "Nature",
        zipCode: "12345",
        country: "Organica",
      },
      paymentMethod: "Credit Card",
      paymentStatus: "paid",
      orderStatus: "delivered",
      createdAt: "2025-05-18T10:30:00Z",
      updatedAt: "2025-05-20T14:45:00Z",
    },
    {
      id: "ORD-002",
      userId: "user2",
      items: [
        {
          product: "3",
          productName: "Fresh Mangoes (Himsagar)",
          quantity: 3,
          price: 15.99,
        },
      ],
      totalAmount: 47.97,
      shippingAddress: {
        street: "456 Organic Ave",
        city: "Freshville",
        state: "Greens",
        zipCode: "67890",
        country: "Organica",
      },
      paymentMethod: "PayPal",
      paymentStatus: "paid",
      orderStatus: "shipped",
      createdAt: "2025-05-19T09:15:00Z",
      updatedAt: "2025-05-20T08:30:00Z",
    },
    {
      id: "ORD-003",
      userId: "user3",
      items: [
        {
          product: "5",
          productName: "Organic Rice (Kataribhog)",
          quantity: 2,
          price: 9.99,
        },
        {
          product: "6",
          productName: "Coconut Oil (Cold Pressed)",
          quantity: 1,
          price: 16.99,
        },
      ],
      totalAmount: 36.97,
      shippingAddress: {
        street: "789 Natural Blvd",
        city: "Eco Town",
        state: "Organic",
        zipCode: "54321",
        country: "Organica",
      },
      paymentMethod: "Credit Card",
      paymentStatus: "paid",
      orderStatus: "pending",
      createdAt: "2025-05-20T14:20:00Z",
      updatedAt: "2025-05-20T14:20:00Z",
    },
    {
      id: "ORD-004",
      userId: "user4",
      items: [
        {
          product: "4",
          productName: "Fresh Lychee",
          quantity: 2,
          price: 14.99,
        },
      ],
      totalAmount: 29.98,
      shippingAddress: {
        street: "101 Pure Lane",
        city: "Green City",
        state: "Eco",
        zipCode: "11223",
        country: "Organica",
      },
      paymentMethod: "Credit Card",
      paymentStatus: "pending",
      orderStatus: "pending",
      createdAt: "2025-05-21T09:00:00Z",
      updatedAt: "2025-05-21T09:00:00Z",
    },
    {
      id: "ORD-005",
      userId: "user5",
      items: [
        {
          product: "7",
          productName: "Fresh Jackfruit",
          quantity: 1,
          price: 19.99,
        },
        {
          product: "8",
          productName: "Organic Mustard Oil",
          quantity: 2,
          price: 11.99,
        },
      ],
      totalAmount: 43.97,
      shippingAddress: {
        street: "202 Eco Drive",
        city: "Nature Valley",
        state: "Green",
        zipCode: "33445",
        country: "Organica",
      },
      paymentMethod: "PayPal",
      paymentStatus: "paid",
      orderStatus: "cancelled",
      createdAt: "2025-05-17T11:30:00Z",
      updatedAt: "2025-05-19T15:45:00Z",
    },
  ];

  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<Order["orderStatus"]>("pending");

  const { toast } = useToast();

  // Current page state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;

  // Get current orders for the active page
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Calculate total pages
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const getStatusBadgeClass = (status: Order["orderStatus"]) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Order["orderStatus"]) => {
    switch (status) {
      case "delivered":
        return <PackageCheck className="h-4 w-4 mr-1 text-green-600" />;
      case "shipped":
        return <Package className="h-4 w-4 mr-1 text-blue-600" />;
      case "cancelled":
        return <PackageX className="h-4 w-4 mr-1 text-red-600" />;
      default:
        return <Package className="h-4 w-4 mr-1" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const viewOrderDetails = (order: Order) => {
    setCurrentOrder(order);
    setIsViewDialogOpen(true);
  };

  const openStatusDialog = (order: Order) => {
    setCurrentOrder(order);
    setSelectedStatus(order.orderStatus);
    setIsStatusDialogOpen(true);
  };

  const updateOrderStatus = () => {
    if (!currentOrder) return;

    const updatedOrders = orders.map((order) =>
      order.id === currentOrder.id
        ? {
            ...order,
            orderStatus: selectedStatus,
            updatedAt: new Date().toISOString(),
          }
        : order
    );

    setOrders(updatedOrders);
    setIsStatusDialogOpen(false);
    setCurrentOrder(null);

    toast({
      title: "Order Status Updated",
      description: `Order ${currentOrder.id} status changed to ${selectedStatus}.`,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Order Management</h1>

      {/* Orders Table */}
      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>User {order.userId.replace("user", "")}</TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : order.paymentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(
                      order.orderStatus
                    )}`}
                  >
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewOrderDetails(order)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                      onClick={() => openStatusDialog(order)}
                    >
                      Update Status
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* View Order Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details - {currentOrder?.id}</DialogTitle>
            <DialogDescription>
              Order placed on{" "}
              {currentOrder && formatDate(currentOrder.createdAt)}
            </DialogDescription>
          </DialogHeader>
          {currentOrder && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Shipping Address</h3>
                  <p className="text-sm mt-1">
                    {currentOrder.shippingAddress.street}
                    <br />
                    {currentOrder.shippingAddress.city},{" "}
                    {currentOrder.shippingAddress.state}{" "}
                    {currentOrder.shippingAddress.zipCode}
                    <br />
                    {currentOrder.shippingAddress.country}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Order Summary</h3>
                  <div className="text-sm mt-1 space-y-1">
                    <p>Payment Method: {currentOrder.paymentMethod}</p>
                    <p>
                      Payment Status:{" "}
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          currentOrder.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : currentOrder.paymentStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {currentOrder.paymentStatus}
                      </span>
                    </p>
                    <p>
                      Order Status:{" "}
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadgeClass(
                          currentOrder.orderStatus
                        )}`}
                      >
                        {currentOrder.orderStatus}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-2">Order Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentOrder.items.map((item) => (
                      <TableRow key={item.product}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          ${(item.quantity * item.price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">
                        Total
                      </TableCell>
                      <TableCell className="font-medium">
                        ${currentOrder.totalAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status for order {currentOrder?.id}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderStatus">Order Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={(value) =>
                  setSelectedStatus(value as Order["orderStatus"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={updateOrderStatus}
              className="bg-green-600 hover:bg-green-700"
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
