"use client";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { getProductsByCategory } from "@/data/products";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { FC } from "react";

type CategoryPageProps = {
  params: {
    slug: string;
  };
};

const CategoryPage: FC<CategoryPageProps> = () => {
  const { slug } = useParams();

  // Ensure slug is always a string
  const slugStr = Array.isArray(slug) ? slug[0] : slug || "";
  const categoryName = slugStr
    ? slugStr.charAt(0).toUpperCase() + slugStr.slice(1)
    : "";

  // Get products for this category
  const products = getProductsByCategory(slugStr);

  return (
    <>
      <section className="bg-organic-50 py-10 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="sm" className="mr-2" asChild>
              <Link href="/products">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to All Products
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-display font-bold mb-2">
            {categoryName} Products
          </h1>
          <p className="text-muted-foreground">
            Browse our selection of organic {categoryName.toLowerCase()}{" "}
            products
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          {products.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-xl font-medium mb-2">
                No products found in this category
              </h3>
              <p className="text-muted-foreground mb-6">
                Try browsing our other categories or check back soon as we
                update our inventory.
              </p>
              <Button asChild>
                <Link href="/products">Browse All Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CategoryPage;
