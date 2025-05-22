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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    stockQuantity: 0,
    featured: false,
    seasonal: false,
    inStock: true,
  });

  const { toast } = useToast();

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stockQuantity"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: `${products.length + 1}`,
      name: formData.name || "New Product",
      slug: formData.name?.toLowerCase().replace(/\s+/g, "-") || "new-product",
      description: formData.description || "Product description",
      price: formData.price || 0,
      images: ["/placeholder.svg"],
      category: formData.category || "Uncategorized",
      tags: [],
      featured: formData.featured || false,
      seasonal: formData.seasonal || false,
      inStock: formData.inStock !== undefined ? formData.inStock : true,
      stockQuantity: formData.stockQuantity || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts([...products, newProduct]);
    setIsAddDialogOpen(false);
    setFormData({});

    toast({
      title: "Product Added",
      description: `${newProduct.name} has been added successfully.`,
    });
  };

  const handleEditProduct = () => {
    if (!currentProduct) return;

    const updatedProducts = products.map((product) =>
      product.id === currentProduct.id
        ? {
            ...product,
            name: formData.name || product.name,
            description: formData.description || product.description,
            price:
              formData.price !== undefined ? formData.price : product.price,
            category: formData.category || product.category,
            featured:
              formData.featured !== undefined
                ? formData.featured
                : product.featured,
            seasonal:
              formData.seasonal !== undefined
                ? formData.seasonal
                : product.seasonal,
            inStock:
              formData.inStock !== undefined
                ? formData.inStock
                : product.inStock,
            stockQuantity:
              formData.stockQuantity !== undefined
                ? formData.stockQuantity
                : product.stockQuantity,
            updatedAt: new Date().toISOString(),
          }
        : product
    );

    setProducts(updatedProducts);
    setIsEditDialogOpen(false);
    setCurrentProduct(null);
    setFormData({});

    toast({
      title: "Product Updated",
      description: "The product has been updated successfully.",
    });
  };

  const handleDeleteProduct = () => {
    if (!currentProduct) return;

    const updatedProducts = products.filter(
      (product) => product.id !== currentProduct.id
    );
    setProducts(updatedProducts);
    setIsDeleteDialogOpen(false);
    setCurrentProduct(null);

    toast({
      title: "Product Deleted",
      description: "The product has been deleted successfully.",
      variant: "destructive",
    });
  };

  const openEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      featured: product.featured,
      seasonal: product.seasonal,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
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
            {currentProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.stockQuantity}</TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      product.inStock
                        ? product.stockQuantity > 10
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.inStock
                      ? product.stockQuantity > 10
                        ? "In Stock"
                        : "Low Stock"
                      : "Out of Stock"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => openDeleteDialog(product)}
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

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Enter the details for the new product below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  value={formData.stockQuantity || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured || false}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("featured", checked)
                  }
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="seasonal"
                  checked={formData.seasonal || false}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("seasonal", checked)
                  }
                />
                <Label htmlFor="seasonal">Seasonal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="inStock"
                  checked={
                    formData.inStock !== undefined ? formData.inStock : true
                  }
                  onCheckedChange={(checked) =>
                    handleSwitchChange("inStock", checked)
                  }
                />
                <Label htmlFor="inStock">In Stock</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddProduct}
              className="bg-green-600 hover:bg-green-700"
            >
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details for {currentProduct?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Product Name</Label>
                <Input
                  id="editName"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPrice">Price</Label>
                <Input
                  id="editPrice"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editCategory">Category</Label>
                <Input
                  id="editCategory"
                  name="category"
                  value={formData.category || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStockQuantity">Stock Quantity</Label>
                <Input
                  id="editStockQuantity"
                  name="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="editFeatured"
                  checked={formData.featured || false}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("featured", checked)
                  }
                />
                <Label htmlFor="editFeatured">Featured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="editSeasonal"
                  checked={formData.seasonal || false}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("seasonal", checked)
                  }
                />
                <Label htmlFor="editSeasonal">Seasonal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="editInStock"
                  checked={formData.inStock || false}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("inStock", checked)
                  }
                />
                <Label htmlFor="editInStock">In Stock</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditProduct}
              className="bg-green-600 hover:bg-green-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
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
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
