"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const NotFound: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 px-4">
        <div className="bg-organic-50 p-6 rounded-full w-24 h-24 flex items-center justify-center mb-6">
          <span className="text-4xl font-display font-bold text-organic-500">
            404
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-center">
          Page Not Found
        </h1>

        <p className="text-muted-foreground text-center max-w-md mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="border-organic-500 text-organic-700 hover:bg-organic-50"
            asChild
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>

          <Button
            className="bg-organic-500 hover:bg-organic-600"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
