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
import { products as initialProducts } from "@/data/products";
import { FormInputConfig } from "@/components/common/form/FormInput";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IProduct,
  PRODUCT_DEFAULT_VALUES,
  ProductTypeWithId,
  productValidation,
} from "@/lib/models/product.model";
import FormModal from "@/components/common/form/FormModal";
import { useFetchMutation } from "@/hooks/use-fetch-mutation";
import axiosRequest from "@/lib/axios";
import useSWR, { mutate } from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import { ReusableTable } from "@/components/common/table/ReusableTable";
import { useSearchParams } from "next/navigation";
import AvatarGroup from "@/components/common/AvatarGroup";

const AdminProducts: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<IProduct | null>(null);
  const [crudModalState, setCrudModalState] = useState<{
    title: string;
    submitText: string;
    isUpdate: boolean;
    productId?: string;
  }>({
    title: "",
    submitText: "",
    isUpdate: false,
  });

  const searchParams = useSearchParams();

  const { data: productList, isLoading: productListLoading } = useSWR(
    `/product?${searchParams.toString()}`,
    (url) => axiosRequest.get(url).then((res) => res.data),
    {
      fallbackData: initialProducts,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { control, handleSubmit, setError, reset } = useForm<FieldValues>({
    defaultValues: PRODUCT_DEFAULT_VALUES,
    resolver: zodResolver(productValidation),
    mode: "all",
  });

  const { isLoading, mutateFn } = useFetchMutation();

  const handleDeleteProduct = () => {
    mutateFn(
      () => axiosRequest.delete(`/product/${crudModalState.productId}`),
      () => {
        setIsDeleteDialogOpen(false);
        setCurrentProduct(null);

        mutate(
          `/product?${searchParams.toString()}`,
          (prevData?: { data: IProduct[] }) => {
            // Filter out the deleted product
            const updatedProducts = prevData?.data.filter(
              (product) => product._id !== crudModalState?.productId
            );

            return {
              ...prevData,
              data: updatedProducts || [],
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

  const openDeleteDialog = (product: IProduct) => {
    setCurrentProduct(product);
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
      // Update existing product
      mutateFn(
        () => axiosRequest.patch(`/product/${crudModalState.productId}`, body),
        () => {
          setIsAddDialogOpen(false);
          reset(PRODUCT_DEFAULT_VALUES);

          mutate(
            `/product?${searchParams.toString()}`,
            (prevData?: { data: IProduct[] }) => {
              // Update the local data with the updated product

              const cloneProducts = [...(prevData?.data || [])];

              const productIndex = prevData?.data.findIndex(
                (product) => product._id === crudModalState.productId
              );

              if (productIndex !== undefined && productIndex >= 0) {
                cloneProducts[productIndex] = formData as IProduct;
                cloneProducts[productIndex]._id = crudModalState.productId;
              }

              // Sort by createdAt in descending order
              return {
                ...prevData,
                data: cloneProducts,
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
        () => axiosRequest.post("/product", body),
        () => {
          setIsAddDialogOpen(false);
          reset(PRODUCT_DEFAULT_VALUES);

          mutate(
            `/product?${searchParams.toString()}`,
            (prevData?: { data: IProduct[] }) => {
              // Update the local data with the new product
              const data = [formData as IProduct, ...(prevData?.data || [])];

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
      label: "Product Name",
      type: "text",
      placeholder: "Enter product name",
      required: true,
    },
    {
      name: "images",
      label: "Image",
      type: "media",
      placeholder: "Upload product image",
      required: true,
      isMultiple: true,
    },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      placeholder: "Enter product slug",
      required: true,
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      placeholder: "Enter product price",
      required: true,
    },
    {
      name: "stockQuantity",
      label: "Stock Quantity",
      type: "number",
      placeholder: "Enter stock quantity",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter product description",
      className: "md:col-span-2",
    },
    {
      name: "categoryId",
      label: "Category",
      type: "select",
      required: true,
      className: "md:col-span-2",
      options: [
        { value: "electronics", label: "Electronics" },
        { value: "clothing", label: "Clothing" },
        { value: "home-appliances", label: "Home Appliances" },
        { value: "books", label: "Books" },
      ],
    },
    {
      name: "isFeatured",
      label: "Featured Product",
      type: "switch",
    },
    {
      name: "isSeasonal",
      label: "Seasonal Product",
      type: "switch",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Button
          onClick={() => {
            reset(PRODUCT_DEFAULT_VALUES);
            setCrudModalState({
              title: "Add New Product",
              submitText: "Add Product",
              isUpdate: false,
            });
            setIsAddDialogOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <ReusableTable<ProductTypeWithId>
        data={productList?.data || []}
        columns={[
          {
            header: "Images",
            accessor: (row) => (
              <div className="flex space-x-2">
                <AvatarGroup
                  data={row.images.map((image) => ({
                    name: row.name,
                    image: image || "",
                  }))}
                />
              </div>
            ),
          },
          { header: "Name", accessor: "name" },
          {
            header: "Price",
            accessor: (row) => `BDT: ${row.price.toFixed(2)}`,
          },
          { header: "Category", accessor: "categoryId" },
          { header: "Stock", accessor: "stockQuantity" },
          {
            header: "Status",
            accessor: (row) =>
              row.stockQuantity > 10 ? (
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 whitespace-nowrap">
                  In Stock
                </span>
              ) : (
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 whitespace-nowrap">
                  Low Stock
                </span>
              ),
          },
        ]}
        pagination={productList?.pagination}
        onEdit={(cell) => {
          reset(cell);
          setCrudModalState({
            title: "Edit Product",
            submitText: "Update Product",
            isUpdate: true,
            productId: String(cell._id),
          });
          setIsAddDialogOpen(true);
        }}
        onDelete={(cell) => {
          setCrudModalState((prev) => ({
            ...prev,
            productId: String(cell._id),
          }));
          openDeleteDialog(cell);
        }}
        hasAction={true}
        isLoading={productListLoading}
      />

      {/* Add or edit Product Dialog */}
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
              Are you sure you want to delete {currentProduct?.name}? This
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
              onClick={handleDeleteProduct}
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

export default AdminProducts;
