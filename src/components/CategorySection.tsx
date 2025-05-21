import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface Category {
  name: string;
  image: string;
  count: number;
  slug: string;
}

const categories: Category[] = [
  {
    name: "Fruits",
    image: "/placeholder.svg",
    count: 12,
    slug: "fruits",
  },
  {
    name: "Sweeteners",
    image: "/placeholder.svg",
    count: 8,
    slug: "sweeteners",
  },
  {
    name: "Grains",
    image: "/placeholder.svg",
    count: 10,
    slug: "grains",
  },
  {
    name: "Oils",
    image: "/placeholder.svg",
    count: 6,
    slug: "oils",
  },
];

const CategorySection: React.FC = () => {
  return (
    <section className="py-16 bg-organic-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold mb-2">
            Browse Categories
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Explore our wide range of organic products organized by category
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link href={`/categories/${category.slug}`} key={category.slug}>
              <Card className="overflow-hidden border border-organic-100 hover:shadow-md transition-shadow group">
                <div className="aspect-square relative overflow-hidden bg-white">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="object-contain w-full h-full transition-transform group-hover:scale-105 duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                    <div className="w-full text-white">
                      <h3 className="text-xl font-display font-medium mb-1">
                        {category.name}
                      </h3>
                      <div className="flex justify-between items-center">
                        <span>{category.count} Products</span>
                        <ArrowRight className="h-5 w-5 transition-transform transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
