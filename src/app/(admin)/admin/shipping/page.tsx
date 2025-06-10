"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormInputConfig } from "@/components/common/form/FormInput";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormModal from "@/components/common/form/FormModal";
import { useFetchMutation } from "@/hooks/use-fetch-mutation";
import axiosRequest from "@/lib/axios";
import useSWR, { mutate } from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import { ReusableTable } from "@/components/common/table/ReusableTable";
import { useSearchParams } from "next/navigation";
import {
  SHIPPING_DEFAULT_VALUES,
  ShippingTypeWithId,
  shippingValidation,
  IShipping,
} from "@/lib/models/shipping/shipping.dto";

const AdminShipping: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentShipping, setCurrentShipping] = useState<IShipping | null>(
    null
  );
  const [crudModalState, setCrudModalState] = useState<{
    title: string;
    submitText: string;
    isUpdate: boolean;
    shipping?: string;
  }>({
    title: "",
    submitText: "",
    isUpdate: false,
  });

  const searchParams = useSearchParams();

  const { data: shippingList, isLoading: shippingListLoading } = useSWR(
    `/shipping?${searchParams.toString()}`,
    (url) => axiosRequest.get(url).then((res) => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { control, handleSubmit, setError, reset } = useForm<FieldValues>({
    defaultValues: SHIPPING_DEFAULT_VALUES,
    resolver: zodResolver(shippingValidation),
    mode: "all",
  });

  const { isLoading, mutateFn } = useFetchMutation();

  const handleDeleteShipping = () => {
    mutateFn(
      () => axiosRequest.delete(`/shipping/${crudModalState.shipping}`),
      () => {
        setIsDeleteDialogOpen(false);
        setCurrentShipping(null);

        mutate(
          `/shipping?${searchParams.toString()}`,
          (prevData?: { data: ShippingTypeWithId[] }) => {
            // Filter out the deleted shipping
            const updatedShipping = prevData?.data.filter(
              (shipping) => shipping._id !== crudModalState?.shipping
            );

            return {
              ...prevData,
              data: updatedShipping || [],
            };
          },
          {
            revalidate: false,
          }
        );
      },
      setError
    );
  };

  const openDeleteDialog = (shipping: IShipping) => {
    setCurrentShipping(shipping);
    setIsDeleteDialogOpen(true);
  };

  const formSubmitHandler = (formData: FieldValues) => {
    const body = {
      ...formData,
    };

    if (formData._id) {
      delete body._id; // Remove _id if present to avoid conflicts
    }

    // Handle form submission logic here
    if (crudModalState.isUpdate) {
      // Update existing shipping
      mutateFn(
        () => axiosRequest.patch(`/shipping/${crudModalState.shipping}`, body),
        () => {
          setIsAddDialogOpen(false);
          reset(SHIPPING_DEFAULT_VALUES);

          mutate(
            `/shipping?${searchParams.toString()}`,
            (prevData?: { data: ShippingTypeWithId[] }) => {
              // Update the local data with the updated shipping

              const cloneShipping = [...(prevData?.data || [])];

              const shippingIndex = prevData?.data.findIndex(
                (shipping) => shipping._id === crudModalState.shipping
              );

              if (shippingIndex !== undefined && shippingIndex >= 0) {
                cloneShipping[shippingIndex] = {
                  ...(formData as IShipping),
                  _id: crudModalState.shipping ?? "",
                };
              }

              // Sort by createdAt in descending order
              return {
                ...prevData,
                data: cloneShipping,
              };
            },
            {
              revalidate: false,
            }
          );
        },
        setError
      );
    } else {
      mutateFn(
        () => axiosRequest.post("/shipping", body),
        () => {
          setIsAddDialogOpen(false);
          reset(SHIPPING_DEFAULT_VALUES);

          mutate(
            `/shipping?${searchParams.toString()}`,
            (prevData?: { data: IShipping[] }) => {
              // Update the local data with the new shipping
              const data = [formData as IShipping, ...(prevData?.data || [])];

              // Sort by createdAt in descending order
              return {
                ...prevData,
                data,
              };
            },
            {
              revalidate: false,
            }
          );
        },
        setError
      );
    }
  };

  const formInputData: FormInputConfig[] = [
    {
      name: "name",
      label: "Shipping Name",
      type: "text",
      placeholder: "Enter shipping name",
      required: true,
    },
    {
      name: "charge",
      label: "Shipping Charge",
      type: "number",
      placeholder: "Enter shipping charge",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter shipping description",
      className: "md:col-span-2",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Shipping Management</h1>
        <Button
          onClick={() => {
            reset(SHIPPING_DEFAULT_VALUES);
            setCrudModalState({
              title: "Add New Shipping",
              submitText: "Add Shipping",
              isUpdate: false,
            });
            setIsAddDialogOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Shipping
        </Button>
      </div>

      <ReusableTable<ShippingTypeWithId>
        data={shippingList?.data || []}
        columns={[
          { header: "Name", accessor: "name" },
          {
            header: "Charge",
            accessor: "charge",
          },
          {
            header: "Description",
            accessor: "description",
          },
        ]}
        pagination={shippingList?.pagination}
        onEdit={(cell) => {
          reset(cell);
          setCrudModalState({
            title: "Edit Shipping",
            submitText: "Update Shipping",
            isUpdate: true,
            shipping: String(cell._id),
          });
          setIsAddDialogOpen(true);
        }}
        onDelete={(cell) => {
          setCrudModalState((prev) => ({
            ...prev,
            shipping: String(cell._id),
          }));
          openDeleteDialog(cell);
        }}
        hasAction={true}
        isLoading={shippingListLoading}
      />

      {/* Add or edit Shipping Dialog */}
      <FormModal
        {...{
          title: crudModalState.title,
          control,
          formData: formInputData,
          inputSize: "md",
          isLoading,
          isAddDialogOpen,
          setIsAddDialogOpen,
          handleSubmit,
          formSubmitHandler,
          submitText: crudModalState.submitText,
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {currentShipping?.name}? This
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
              onClick={handleDeleteShipping}
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
      </Dialog>
    </div>
  );
};

export default AdminShipping;
