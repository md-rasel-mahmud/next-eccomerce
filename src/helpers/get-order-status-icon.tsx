import { OrderStatus } from "@/enums/Status.enum";
import { IOrder } from "@/lib/models/order/order.dto";
import { Package, PackageCheck, PackageX } from "lucide-react";

export const getOrderStatusIcon = (status: IOrder["status"]) => {
  switch (status) {
    case OrderStatus.DELIVERED:
      return <PackageCheck className="h-4 w-4 mr-1 text-green-600" />;
    case OrderStatus.SHIPPED:
      return <Package className="h-4 w-4 mr-1 text-blue-600" />;
    case OrderStatus.CANCELLED:
      return <PackageX className="h-4 w-4 mr-1 text-red-600" />;
    default:
      return <Package className="h-4 w-4 mr-1" />;
  }
};
