import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import axiosRequest from "@/lib/axios";

const HeroSection: React.FC = async () => {
  const { data } = await axiosRequest.get("/setting");
  const banner = data?.data[0]?.banner;

  return (
    <section className="relative bg-organic-50 hero-bg-pattern py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1 animate-fade-in">
            <span className="inline-block mb-3 bg-organic-100 text-organic-700 px-3 py-1 rounded-full text-sm font-medium">
              100% Certified Organic
            </span>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-display font-bold  leading-tight mb-4">
              {banner?.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              {banner?.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-organic-500 hover:bg-organic-600 text-white px-8"
                asChild
              >
                <Link href="/products">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-organic-500 text-organic-700 hover:bg-organic-50"
                asChild
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg shadow-sm">
                <span className="text-xl font-bold text-organic-700">100%</span>
                <span className="text-sm text-muted-foreground">Organic</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg shadow-sm">
                <span className="text-xl font-bold text-organic-700">
                  Fresh
                </span>
                <span className="text-sm text-muted-foreground">Seasonal</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-white rounded-lg shadow-sm">
                <span className="text-xl font-bold text-organic-700">Free</span>
                <span className="text-sm text-muted-foreground">Delivery</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative">
              <Image
                src={banner?.bannerImages?.[0] || "/placeholder.svg"}
                alt={banner?.title || "Organic Food"}
                className="w-full h-[65vh] object-cover object-top rounded-xl shadow-lg animate-slide-in"
                width={500}
                height={500}
              />
              {banner?.hasOffer && (
                <div className="absolute top-5 right-5 bg-white p-3 rounded-lg shadow-lg">
                  <div className="bg-organic-500 text-white rounded-md p-2 flex items-center gap-2">
                    <div className="text-sm">
                      <p className="font-medium">{banner.offer.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {banner.offer.description}
                      </p>
                    </div>
                    <span className="text-xl font-bold">
                      {banner.offer.amount}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
