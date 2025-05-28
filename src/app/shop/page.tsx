"use client";

import React, { useCallback, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import axiosRequest from "@/lib/axios";
import { debounce, setQueryStringBySearchParams } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types/types";
import TwoWaySlider from "@/components/common/form/TwoWaySlider";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ProductsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const router = useRouter();
  const pathname = usePathname();

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [showInStock, setShowInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");

  const { data: productList, isLoading: productListLoading } = useSWR(
    `/product?${searchParams.toString()}`,
    (url) => axiosRequest.get(url).then((res) => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { data: categoryList, isLoading: categoryListLoading } = useSWR(
    `/category/options`,
    (url) => axiosRequest.get(url).then((res) => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const categories = categoryList?.data || [];
  const pagination = productList?.pagination || {};
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentLimit = searchParams.get("limit") || "10";
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || productList?.data?.length;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedPriceUpdate = useCallback(
    debounce((value: [number, number]) => {
      const query = setQueryStringBySearchParams(searchParams, {
        minPrice: value[0].toString(),
        maxPrice: value[1].toString(),
      });

      router.push(`${pathname}?${query}`);
    }, 100),
    [searchParams, pathname]
  );

  const handlePriceRangeChange = (value: number | number[]) => {
    if (Array.isArray(value) && value.length === 2) {
      setPriceRange(value as [number, number]);
      debouncedPriceUpdate(value as [number, number]);
    }
  };

  const handleCategoryChange = (category: string) => {
    const query = setQueryStringBySearchParams(searchParams, {
      category,
    });
    router.push(`${pathname}?${query}`);
  };

  const handlePageChange = (page: number) => {
    const query = setQueryStringBySearchParams(searchParams, {
      page: page.toString(),
    });
    router.push(`${pathname}?${query}`);
  };

  const handleLimitChange = (value: string) => {
    const query = setQueryStringBySearchParams(searchParams, {
      limit: value,
      page: "1",
    });
    router.push(`${pathname}?${query}`);
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
            {/* Sidebar */}
            <div className="lg:w-1/4 space-y-8">
              <div>
                <h3 className="font-display text-xl font-medium mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categoryListLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 animate-pulse"
                      >
                        <Skeleton className="h-4 w-5 rounded-full mb-2" />
                        <Skeleton className="h-4 w-44" />
                      </div>
                    ))
                  ) : (
                    <RadioGroup
                      value={categoryParam || ""}
                      onValueChange={handleCategoryChange}
                      className="space-y-2"
                    >
                      {categories.map(
                        (category: {
                          value: string;
                          label: string;
                          slug: string;
                        }) => (
                          <div
                            key={category.value}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={category.slug}
                              id={category.slug}
                            />
                            <Label htmlFor={category.slug}>
                              {category.label}
                            </Label>
                          </div>
                        )
                      )}
                    </RadioGroup>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl font-medium mb-4">
                  Price Range
                </h3>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    ৳{priceRange[0]} - ৳{priceRange[1]}
                  </p>
                </div>
                <TwoWaySlider
                  value={priceRange}
                  max={10000}
                  min={0}
                  onChange={handlePriceRangeChange}
                />
              </div>

              <div>
                <h3 className="font-display text-xl font-medium mb-4">
                  Availability
                </h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-stock"
                    checked={showInStock}
                    onCheckedChange={() => {
                      setShowInStock(!showInStock);
                      const query = setQueryStringBySearchParams(searchParams, {
                        inStock: (!showInStock).toString(),
                      });
                      router.push(`${pathname}?${query}`);
                    }}
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
                onClick={() => router.push(`${pathname}`)}
              >
                Reset Filters
              </Button>
            </div>

            {/* Product Grid */}
            <div className="lg:w-3/4">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <p className="text-muted-foreground mb-4 sm:mb-0">
                  Showing {productList?.data?.length} of Total {totalItems}{" "}
                  products
                </p>

                <Select
                  value={sortBy}
                  onValueChange={(value) => {
                    setSortBy(value);
                    const query = setQueryStringBySearchParams(searchParams, {
                      sortBy: value,
                    });
                    router.push(`${pathname}?${query}`);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-auto gap-2">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {productList?.data?.length === 0 ? (
                <div className="text-center py-10">
                  <h3 className="text-xl font-medium mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to find what you&apos;re looking
                    for.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productListLoading
                    ? Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                          <Skeleton className="h-64 w-full mb-4" />
                          <Skeleton className="h-6 w-full mb-2" />
                          <Skeleton className="h-6 w-3/4" />
                        </div>
                      ))
                    : productList?.data?.map((product: Product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                </div>
              )}

              {/* Pagination */}
              <div className="py-4 mt-8 flex items-center gap-4 flex-wrap">
                <Pagination>
                  <PaginationContent>
                    <Select
                      value={currentLimit}
                      onValueChange={handleLimitChange}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue placeholder={currentLimit} />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 20, 50, 100].map((limit) => (
                          <SelectItem key={limit} value={limit.toString()}>
                            {limit} items
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          handlePageChange(Math.max(currentPage - 1, 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(totalPages, 5) }).map(
                      (_, i) => {
                        const pageNumber = i + 1;
                        return (
                          <PaginationItem key={i}>
                            <PaginationLink
                              onClick={() => handlePageChange(pageNumber)}
                              isActive={currentPage === pageNumber}
                              className="cursor-pointer"
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                    )}

                    {totalPages > 5 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          handlePageChange(
                            Math.min(currentPage + 1, totalPages)
                          )
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductsPage;
