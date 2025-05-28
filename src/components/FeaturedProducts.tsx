import React from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { Product } from "@/types/types";
import Link from "next/link";

import axiosRequest from "@/lib/axios";

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = async ({
  title,
  subtitle,
  viewAllLink,
}) => {
  try {
    const res = await axiosRequest.get("/product?isFeatured=true");

    const data = res.data;
    const products: Product[] = data?.data || [];

    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">{title}</h2>
              {subtitle && (
                <p className="text-muted-foreground max-w-lg">{subtitle}</p>
              )}
            </div>

            {viewAllLink && (
              <Button
                variant="outline"
                className="mt-4 sm:mt-0 border-organic-500 text-organic-700 hover:bg-organic-50"
                asChild
              >
                <Link href={viewAllLink}>View All Products</Link>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error fetching products:", error);

    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold mb-2">
            Featured Products
          </h2>
          <p className="text-muted-foreground max-w-lg">
            Unable to load featured products at this time.
          </p>
        </div>
      </section>
    );
  }
};

export default FeaturedProducts;
