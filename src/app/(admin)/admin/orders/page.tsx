"use client";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useFetchMutation } from "@/hooks/use-fetch-mutation";
import axiosRequest from "@/lib/axios";
import useSWR, { mutate } from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ColumnConfig,
  ReusableTable,
} from "@/components/common/table/ReusableTable";
import { useRouter, useSearchParams } from "next/navigation";
import { cn, getCurrencySymbol, getOrderStatusBadgeClass } from "@/lib/utils";
import { OrderTypeWithId } from "@/lib/models/order/order.dto";
import { OrderStatus } from "@/enums/Status.enum";
import moment from "moment";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentMethods } from "@/enums/PaymentMethods.enum";
import { getOrderStatusIcon } from "@/helpers/get-order-status-icon";

const AdminOrders: React.FC = () => {
  // const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const { data: orderList, isLoading: orderListLoading } = useSWR(
    `/order?${searchParams.toString()}`,
    (url) => axiosRequest.get(url).then((res) => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { isLoading: orderStatusUpdateLoading, mutateFn } = useFetchMutation();

  // const handleDeleteOrder = () => {
  //   mutateFn(
  //     () => axiosRequest.delete(`/order/${crudModalState.orderId}`),
  //     () => {
  //       setIsDeleteDialogOpen(false);
  //       setCurrentOrder(null);

  //       mutate(
  //         `/order?${searchParams.toString()}`,
  //         (prevData?: { data: OrderTypeWithId[] }) => {
  //           // Filter out the deleted order
  //           const updatedOrders = prevData?.data.filter(
  //             (order) => order._id !== crudModalState?.orderId
  //           );

  //           return {
  //             ...prevData,
  //             data: updatedOrders || [],
  //           };
  //         },
  //         {
  //           revalidate: false,
  //         }
  //       );
  //     },
  //     setError
  //   );
  // };

  // const openDeleteDialog = (order: IOrder) => {
  //   setCurrentOrder(order);
  //   setIsDeleteDialogOpen(true);
  // };

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
      header: "Update Status",
      accessor: (row) => {
        return (
          <>
            {
              // update status dropdown
            }
            {orderStatusUpdateLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <Select
                value={row.status}
                onValueChange={(value) => {
                  mutateFn(
                    () =>
                      axiosRequest.patch(`/order/update-status`, {
                        orderId: row.orderId,
                        status: value,
                      }),
                    () => {
                      // Update the local data with the new status
                      mutate(
                        `/order?${searchParams.toString()}`,
                        (prevData?: { data: OrderTypeWithId[] }) => {
                          const updatedOrders = prevData?.data.map((order) => {
                            if (order._id === row._id) {
                              return {
                                ...order,
                                status: value as OrderStatus,
                              };
                            }
                            return order;
                          });

                          return {
                            ...prevData,
                            data: updatedOrders || [],
                          };
                        },
                        {
                          revalidate: false,
                        }
                      );
                    }
                  );
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Order Status</SelectLabel>
                    {Object.values(OrderStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </>
        );
      },
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

          {/* <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => openDeleteDialog(row)}
                    >
                      <Trash />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete this order</p>
                  </TooltipContent>
                </Tooltip> */}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Order Management</h1>
      </div>

      <ReusableTable<OrderTypeWithId>
        data={orderList?.data || []}
        columns={columns}
        pagination={orderList?.pagination}
        hasAction={false}
        isLoading={orderListLoading}
      />

      {/* Delete Confirmation Dialog */}
      {/* <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {currentOrder?.fullName}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteOrder}
              disabled={isLoading}
              type="button"
            >
              {isLoading ? (
                <>
                  Loading... <Skeleton className="h-5 w-5" />
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default AdminOrders;
