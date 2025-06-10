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
import AvatarGroup from "@/components/common/AvatarGroup";
import { convertDataToObjectByKey } from "@/lib/utils";
import {
  IProduct,
  PRODUCT_DEFAULT_VALUES,
  ProductTypeWithId,
  productValidation,
} from "@/lib/models/product/product.dto";

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
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { data: categoryOptions, isLoading: categoryOptionsLoading } = useSWR(
    `/category/options`,
    (url) => axiosRequest.get(url).then((res) => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const categoryObjectById = convertDataToObjectByKey(
    categoryOptions?.data || [],
    "value"
  );

  const { control, handleSubmit, setError, reset, watch, setValue } =
    useForm<FieldValues>({
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
          (prevData?: { data: ProductTypeWithId[] }) => {
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
      delete body.discountPercentage; // Remove discountPercentage as it's not needed in the request
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (prevData?: { data: any[] }) => {
              // Update the local data with the updated product

              const cloneProducts = [...(prevData?.data || [])];

              const productIndex = prevData?.data.findIndex(
                (product) => product._id === crudModalState.productId
              );

              if (productIndex !== undefined && productIndex >= 0) {
                cloneProducts[productIndex] = formData as IProduct;
                cloneProducts[productIndex]._id = crudModalState.productId;
                cloneProducts[productIndex].category = {
                  name: categoryObjectById[formData.category]?.label || "",
                  slug: categoryObjectById[formData.category]?.slug || "",
                  _id: categoryObjectById[formData.category]?.value || "",
                  image: categoryObjectById[formData.category]?.image || "",
                };
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (prevData?: { data: any[] }) => {
              // Update the local data with the new product

              const createdProduct = {
                ...formData,
                category: {
                  name: categoryObjectById[formData.category]?.label || "",
                  slug: categoryObjectById[formData.category]?.slug || "",
                  _id: categoryObjectById[formData.category]?.value || "",
                  image: categoryObjectById[formData.category]?.image || "",
                },
              };

              const data = [createdProduct, ...(prevData?.data || [])];

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
      extraOnChange: (value) => {
        const slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        setValue("slug", slug);
      },
    },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      placeholder: "Enter product slug",
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
      name: "price",
      label: "Price",
      type: "number",
      placeholder: "Enter product price",
      required: true,
    },
    {
      name: "discount",
      label: "Discount Amount",
      type: "number",
      placeholder: "Enter discount percentage",
      required: false,
      extraOnChange: (value) => {
        const price = watch("price");

        if (value > 0 && price > 0) {
          const discountPercentage = ((price - value) / price) * 100;
          setValue("discountPercentage", discountPercentage);
        } else {
          setValue("discountPercentage", 0);
        }
      },
    },
    {
      name: "discountPercentage",
      label: "Discount Percentage (%)",
      type: "number",
      placeholder: "Enter discount percentage",
      required: false,
      extraOnChange: (value) => {
        const price = watch("price");

        if (value > 0 && price > 0) {
          const discountAmount = (price * value) / 100;
          setValue("discount", price - discountAmount);
        } else {
          setValue("discount", 0);
        }
      },
    },
    {
      name: "stockQuantity",
      label: "Stock Quantity",
      type: "number",
      placeholder: "Enter stock quantity",
      required: true,
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      className: "md:col-span-2 lg:col-span-2",
      options: categoryOptions?.data || [],
      disabled: categoryOptionsLoading,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter product description",
      className: "md:col-span-2 lg:col-span-3",
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
          {
            header: "Category",
            accessor: (row) =>
              typeof row.category === "object" && row.category !== null
                ? row.category.name
                : row.category,
          },
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
          if (typeof cell.category === "object") {
            reset({ ...cell, category: cell.category?._id || cell.category });
            setCrudModalState({
              title: "Edit Product",
              submitText: "Update Product",
              isUpdate: true,
              productId: String(cell._id),
            });
            setIsAddDialogOpen(true);
          }
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
          dialogContentClassName: "sm:max-w-[1000px]",
          inputParentClassName:
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
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
