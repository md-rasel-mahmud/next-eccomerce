import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import axiosRequest from "@/lib/axios";

interface Category {
  name: string;
  image: string;
  count: number;
  slug: string;
}

const CategorySection: React.FC = async () => {
  try {
    const searchParams = new URLSearchParams();

    const res = await axiosRequest.get(`/category?${searchParams.toString()}`);
    const categories = res.data.data as Category[];

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
            {categories?.map((category) => (
              <Link href={`/categories/${category.slug}`} key={category.slug}>
                <Card className="overflow-hidden border border-organic-100 hover:shadow-lg hover:border-organic-500 transition-shadow group">
                  <div className="aspect-square relative overflow-hidden bg-white">
                    <Image
                      src={category.image}
                      alt={category.name}
                      className="object-contain w-full h-full transition-transform group-hover:scale-105 duration-300"
                      width={300}
                      height={300}
                    />

                    <div className="absolute inset-0 text-center bg-gradient-to-t from-black to-transparent flex items-center justify-center p-6">
                      <div className="w-full flex flex-col gap-4 items-center text-white">
                        <h3 className="text-8xl font-display font-medium mb-1 transition-transform">
                          {category.name}
                        </h3>

                        <div className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <ArrowRight />
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
  } catch (error) {
    console.error("Error fetching categories:", error);
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center">
            Failed to load categories
          </h2>
        </div>
      </section>
    );
  }
};

export default CategorySection;
