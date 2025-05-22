import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Check } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Product } from "@/types/types";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { state, dispatch } = useStore();
  const isInCart = state.cart.some((item) => item.productId === product.id);

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", product });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md border border-organic-100 group">
      <Link href={`/product/${product.slug}`} className="block overflow-hidden">
        <div className="aspect-square overflow-hidden bg-organic-50 relative">
          <Image
            src={product.images[0]}
            alt={product.name}
            className="object-cover w-full h-full transition-transform group-hover:scale-105 duration-500"
            height={300}
            width={300}
          />

          {/* Product badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.seasonal && (
              <Badge className="bg-earth-500 hover:bg-earth-500">
                Seasonal
              </Badge>
            )}
            {product.salePrice && (
              <Badge className="bg-organic-500 hover:bg-organic-600">
                Sale
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="mb-1 flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">
            {product.category}
          </span>
          {product.rating && (
            <div className="flex items-center">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
          )}
        </div>

        <Link href={`/product/${product.slug}`}>
          <h3 className="font-display text-lg font-medium mb-1 hover:text-organic-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          {product.salePrice ? (
            <>
              <span className="font-medium text-lg">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="font-medium text-lg">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0">
        <Button
          className={`w-full gap-2 ${
            isInCart
              ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
              : "bg-organic-500 hover:bg-organic-600 text-white"
          }`}
          disabled={!product.inStock}
          onClick={handleAddToCart}
        >
          {isInCart ? (
            <>
              <Check className="h-4 w-4" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
