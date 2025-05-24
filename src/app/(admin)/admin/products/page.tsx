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
import { Pencil, Trash2, Plus } from "lucide-react";
import { Product } from "@/types/types";
import { products as initialProducts } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FormInputConfig } from "@/components/common/form/FormInput";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IProduct,
  PRODUCT_DEFAULT_VALUES,
  productValidation,
} from "@/lib/models/product.model";
import FormModal from "@/components/common/form/FormModal";
import { useFetchMutation } from "@/hooks/use-fetch-mutation";
import axiosRequest from "@/lib/axios";
import useSWR, { mutate } from "swr";
import { Skeleton } from "@/components/ui/skeleton";

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
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

  const { data: productList } = useSWR(
    "/product",
    (url) => axiosRequest.get(url).then((res) => res.data),
    {
      fallbackData: initialProducts,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { toast } = useToast();

  const { control, handleSubmit, setError, reset } = useForm<IProduct>({
    defaultValues: PRODUCT_DEFAULT_VALUES,
    resolver: zodResolver(productValidation),
    mode: "all",
  });

  const { isLoading, mutateFn } = useFetchMutation();

  // Current page state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  // Get current products for the active page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Calculate total pages
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleDeleteProduct = () => {
    mutateFn(
      () => axiosRequest.delete(`/product/${crudModalState.productId}`),
      () => {
        setIsDeleteDialogOpen(false);
        setCurrentProduct(null);

        mutate(
          "/product",
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

  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const formSubmitHandler = (formData: IProduct) => {
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
            "/product",
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
            "/product",
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

      {/* Products Table */}
      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productList?.data?.map((product: IProduct, index: number) => (
              <TableRow key={`${product._id}-${index}`}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>BDT: {product.price.toFixed(2)}</TableCell>
                <TableCell>{product.categoryId}</TableCell>
                <TableCell>{product.stockQuantity}</TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                      product.stockQuantity > 10
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {product.stockQuantity > 10 ? "In Stock" : "Low Stock"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        reset(product);
                        setCrudModalState({
                          title: "Edit Product",
                          submitText: "Update Product",
                          isUpdate: true,
                          productId: String(product._id),
                        });
                        setIsAddDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => {
                        setCrudModalState((prev) => ({
                          ...prev,
                          productId: String(product._id),
                        }));
                        openDeleteDialog(product);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
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

              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNumber)}
                      isActive={currentPage === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {totalPages > 5 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

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
          formSubmitHandler: handleSubmit(formSubmitHandler),
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
