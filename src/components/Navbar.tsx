"use client";
import React, { useState } from "react";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  Package,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Roles } from "@/enums/Roles.enum";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { dashboardItems } from "@/constants/nav-menu";
import useSWR from "swr";
import axiosRequest from "@/lib/axios";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const state = useSelector((state: RootState) => state.cart);
  const { data } = useSession();

  const { data: categoryList, isLoading: categoryListLoading } = useSWR(
    `/category/options`,
    (url) => axiosRequest.get(url).then((res) => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const user = data?.user;
  const isAdmin = user?.role === Roles.ADMIN;

  const cartItemCount = state.cart.reduce(
    (count, item) => count + item.quantity,
    0
  );

  const handleLogout = () => {
    signOut({
      callbackUrl: "/",
    }).catch((error) => {
      console.error("Error signing out:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      });
    });

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-organic-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-organic-500 text-2xl md:text-3xl font-display font-bold">
              Organic<span className="text-earth-500">Harvest</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList>
                {dashboardItems.map((item) => (
                  <NavigationMenuItem key={item.link}>
                    <Link
                      href={item.link}
                      className={
                        navigationMenuTriggerStyle() + " bg-transparent"
                      }
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuItem>
                ))}

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    Categories
                    {categoryListLoading && <Skeleton />}
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[300px] md:grid-cols-2">
                      {categoryList?.data?.map(
                        (category: {
                          slug: string;
                          label: string;
                          image: string;
                        }) => (
                          <li key={category.slug}>
                            <Link
                              href={`/shop?category=${category.slug}`}
                              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition"
                            >
                              <Image
                                src={category.image}
                                alt={category.label}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                              />
                              <span>{category.label}</span>
                            </Link>
                          </li>
                        )
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account">
                  {user ? (
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user ? (
                  <>
                    <DropdownMenuLabel>
                      <div className="font-medium">Hello, {user?.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {user.role}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="w-full cursor-pointer">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="w-full cursor-pointer">
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin"
                          className="w-full cursor-pointer text-organic-600"
                        >
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="w-full cursor-pointer">
                        Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register" className="w-full cursor-pointer">
                        Register
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/cart" className="relative">
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Shopping cart with ${cartItemCount} items`}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-organic-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation Buttons */}
          <div className="flex lg:hidden items-center gap-3">
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" aria-label="Shopping cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-organic-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-organic-100 absolute w-full left-0 right-0 z-30 shadow-lg animate-fade-in">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-4">
              {dashboardItems.map((item) => (
                <Link
                  key={item.link}
                  href={item.link}
                  className="px-4 py-2 text-foreground hover:bg-organic-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}

              {user ? (
                <>
                  <div className="border-t border-organic-100 pt-4 mt-2">
                    <div className="px-4 py-2">
                      <div className="font-medium">Hello, {user.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {user.role}
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    className="px-4 py-2 text-foreground hover:bg-organic-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="px-4 py-2 text-foreground hover:bg-organic-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Package className="h-4 w-4 inline mr-2" />
                    My Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="px-4 py-2 text-organic-600 font-medium hover:bg-organic-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}

                  <Button
                    variant="ghost"
                    className="justify-start px-4 py-6 h-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="border-t border-organic-100 pt-4 mt-2 space-y-4">
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-center bg-organic-500 text-white rounded-md hover:bg-organic-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 text-center border border-organic-500 text-organic-500 rounded-md hover:bg-organic-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}

              <div className="pt-2 pb-4">
                <Button
                  className="w-full bg-organic-500 hover:bg-organic-600 text-white"
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Products
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 animate-fade-in">
          <div className="container mx-auto px-4 pt-20 pb-10">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display">Search Products</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(false)}
                  aria-label="Close search"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full border-2 border-organic-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-organic-500"
                  autoFocus
                />
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Popular searches: Honey, Mango, Rice
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
