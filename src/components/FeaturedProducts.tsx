import React from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { Product } from "@/models/types";
import Link from "next/link";

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  title,
  subtitle,
  products,
  viewAllLink,
}) => {
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
