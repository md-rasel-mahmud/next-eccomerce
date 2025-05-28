// User Model
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  role: "user" | "admin";
}

// Product Model
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category:
    | string
    | {
        name: string;
        slug: string;
        _id: string;
        image?: string;
        description?: string;
      };
  badge?: string;
  tags: string[];
  isFeatured: boolean;
  isSeasonal: boolean;
  stockQuantity: number;
  rating?: number;
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

// Review Model
export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Cart Item Model
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

// Order Model
export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
