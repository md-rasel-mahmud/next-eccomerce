import React from "react";
import Link from "next/link";
import { Package, ShoppingBag, Heart, CreditCard, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";

export const UserDashboard: React.FC = () => {
  const { data } = useSession();

  const user = data?.user;

  const dashboardItems = [
    {
      title: "Your Orders",
      description: "Track, return, or buy things again",
      icon: Package,
      link: "/orders",
      color: "bg-organic-50 text-organic-500",
    },
    {
      title: "Your Cart",
      description: "Items you've added to your cart",
      icon: ShoppingBag,
      link: "/cart",
      color: "bg-earth-100 text-earth-500",
    },
    {
      title: "Your Wishlist",
      description: "Products you're interested in",
      icon: Heart,
      link: "/wishlist",
      color: "bg-red-50 text-red-500",
    },
    {
      title: "Payment Methods",
      description: "Manage your payment options",
      icon: CreditCard,
      link: "/payment",
      color: "bg-blue-50 text-blue-500",
    },
    {
      title: "Account Settings",
      description: "Manage your personal information",
      icon: User,
      link: "/profile",
      color: "bg-purple-50 text-purple-500",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-organic-500 to-organic-600 text-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold">Welcome back, {user?.name}</h2>
        <p className="opacity-90 mt-1">Here&apos;s a summary of your account</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardItems.map((item, index) => (
          <Link
            href={item.link}
            key={index}
            className="group hover-scale focus:outline-none focus:ring-2 focus:ring-organic-500 focus:ring-offset-2 rounded-lg"
          >
            <Card className="h-full border-2 border-transparent transition-all duration-300 hover:border-organic-200">
              <CardHeader className="pb-2">
                <div
                  className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center mb-2`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg group-hover:text-organic-500 transition-colors">
                  {item.title}
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                {item.title === "Your Orders" && (
                  <p className="text-sm text-muted-foreground">
                    View your recent orders
                  </p>
                )}
                {item.title === "Your Cart" && (
                  <p className="text-sm text-muted-foreground">
                    Continue shopping
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your recent purchases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="bg-muted p-3 rounded-md flex items-center justify-between">
                <div>
                  <p className="font-medium">Order #12345</p>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Delivered
                </span>
              </div>
              <div className="bg-muted p-3 rounded-md flex items-center justify-between">
                <div>
                  <p className="font-medium">Order #12344</p>
                  <p className="text-sm text-muted-foreground">1 week ago</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Delivered
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <CardHeader>
            <CardTitle>Recommended For You</CardTitle>
            <CardDescription>Based on your shopping habits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="bg-muted p-3 rounded-md flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                <div>
                  <p className="font-medium">Organic Honey</p>
                  <p className="text-sm text-muted-foreground">$12.99</p>
                </div>
              </div>
              <div className="bg-muted p-3 rounded-md flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                <div>
                  <p className="font-medium">Fresh Avocados (Pack of 4)</p>
                  <p className="text-sm text-muted-foreground">$8.99</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
