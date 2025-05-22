"use client";
import React, { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { products } from "@/data/products";
import { useSearchParams } from "next/navigation";

const ProductsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  // State for filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20]);
  const [showInStock, setShowInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");

  // Get unique categories
  const categories = [...new Set(products.map((product) => product.category))];

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(product.category)
    ) {
      return false;
    }

    // Price filter
    const price = product.salePrice || product.price;
    if (price < priceRange[0] || price > priceRange[1]) {
      return false;
    }

    // Stock filter
    if (showInStock && !product.inStock) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts];
  switch (sortBy) {
    case "price-low":
      sortedProducts.sort(
        (a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)
      );
      break;
    case "price-high":
      sortedProducts.sort(
        (a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)
      );
      break;
    case "newest":
      sortedProducts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "rating":
      sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    default:
      // Featured (default)
      sortedProducts.sort(
        (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      );
      break;
  }

  // Handle category filter change
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  return (
    <>
      <section className="bg-organic-50 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-display font-bold mb-2">Our Products</h1>
          <p className="text-muted-foreground">
            Explore our wide range of organic and natural products
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar / Filters */}
            <div className="lg:w-1/4 space-y-8">
              <div>
                <h3 className="font-display text-xl font-medium mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div className="flex items-center space-x-2" key={category}>
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl font-medium mb-4">
                  Price Range
                </h3>
                <Slider
                  defaultValue={[priceRange[0], priceRange[1]]}
                  max={50}
                  step={1}
                  onValueChange={(value) => setPriceRange([value[0], value[1]])}
                  className="mb-6"
                />
                <div className="flex items-center justify-between">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}+</span>
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl font-medium mb-4">
                  Availability
                </h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-stock"
                    checked={showInStock}
                    onCheckedChange={() => setShowInStock(!showInStock)}
                  />
                  <label
                    htmlFor="in-stock"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show only in-stock items
                  </label>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedCategories(categoryParam ? [categoryParam] : []);
                  setPriceRange([0, 20]);
                  setShowInStock(false);
                  setSortBy("featured");
                }}
              >
                Reset Filters
              </Button>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <p className="text-muted-foreground mb-4 sm:mb-0">
                  Showing {sortedProducts.length} products
                </p>

                <div className="w-full sm:w-auto">
                  <select
                    className="w-full sm:w-auto p-2 border rounded-md"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {sortedProducts.length === 0 ? (
                <div className="text-center py-10">
                  <h3 className="text-xl font-medium mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to find what you&#39;re looking
                    for.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductsPage;
