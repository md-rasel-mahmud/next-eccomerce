"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import axiosRequest from "@/lib/axios";
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { FC, useState } from "react";
import useSWR from "swr";

type ProductDetailsPageProps = {
  params: {
    slug: string;
  };
};

const ProductDetailsPage: FC<ProductDetailsPageProps> = () => {
  const { slug } = useParams();

  // const product = getProductBySlug(slug || "");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { state, dispatch } = useStore();

  const { data: singleProduct, isLoading: productListLoading } = useSWR(
    `/product/${slug}`,
    (url) => axiosRequest.get(url).then((res) => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const product = singleProduct?.data;

  const isInCart = state.cart.some((item) => item.product === product?._id);

  if (productListLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading Product...</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="mb-6">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </>
    );
  }

  const handleAddToCart = () => {
    if (product) {
      dispatch({ type: "ADD_TO_CART", product, quantity });
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center text-organic-600 hover:text-organic-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-organic-50 rounded-lg overflow-hidden">
              <Image
                src={product.images[activeImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain"
                width={500}
                height={500}
              />
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image: string, idx: number) => (
                  <div
                    key={idx}
                    className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                      idx === activeImage
                        ? "border-organic-500"
                        : "border-transparent"
                    }`}
                    onClick={() => setActiveImage(idx)}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - view ${idx + 1}`}
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-2">
              <Link
                href={`/shop?category=${product?.category?.slug?.toLowerCase()}`}
              >
                <Badge variant="outline" className="mb-2">
                  {product?.category?.name || "Uncategorized"}
                </Badge>
              </Link>
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              {product.rating && (
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product?.rating ?? 0)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium">
                    {product.rating} Rating
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mb-6">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-medium">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                  <Badge className="bg-organic-500">
                    {Math.round(
                      ((product.price - product.salePrice) / product.price) *
                        100
                    )}
                    % OFF
                  </Badge>
                </>
              ) : (
                <span className="text-3xl font-medium">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <div className="prose prose-green max-w-none mb-6">
              <p>{product.description}</p>
            </div>

            {product.stockQuantity > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center">
                  <label htmlFor="quantity" className="mr-4 font-medium">
                    Quantity:
                  </label>
                  <div className="flex items-center border rounded overflow-hidden">
                    <button
                      onClick={decrementQuantity}
                      className="px-3 py-2 bg-organic-50 hover:bg-organic-100"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 flex items-center justify-center min-w-[40px]">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="px-3 py-2 bg-organic-50 hover:bg-organic-100"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className={`flex-1 gap-2 ${
                      isInCart
                        ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                        : "bg-organic-500 hover:bg-organic-600 text-white"
                    }`}
                    onClick={handleAddToCart}
                  >
                    {isInCart ? (
                      <>
                        <Check className="h-5 w-5" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" />
                        Add to Cart
                      </>
                    )}
                  </Button>

                  <Button
                    size="lg"
                    variant="secondary"
                    className="flex-1"
                    asChild
                  >
                    <Link href="/checkout">Buy Now</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <Button disabled className="w-full" size="lg">
                Out of Stock
              </Button>
            )}

            <div className="border-t border-border mt-8 pt-6">
              <h3 className="font-medium mb-2">Product Details:</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <span className="text-muted-foreground">Category:</span>{" "}
                  {product?.category?.name}
                </li>

                {product.tags?.length > 0 && (
                  <li>
                    <span className="text-muted-foreground">Tags:</span>{" "}
                    {product.tags.join(", ")}
                  </li>
                )}
                {product.isSeasonal && (
                  <li>
                    <span className="text-muted-foreground">Seasonal:</span> Yes
                  </li>
                )}
                <li>
                  <span className="text-muted-foreground">Stock:</span>{" "}
                  {product.stockQuantity} units
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;
