import React, { Suspense } from "react";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategorySection from "@/components/CategorySection";
import AboutUs from "@/components/AboutUs";

const Home: React.FC = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection />
      </Suspense>

      <FeaturedProducts
        title="Featured Products"
        subtitle="Handpicked selection of our best organic products for you"
        viewAllLink="/shop"
      />

      <CategorySection />

      <Suspense fallback={<div>Loading our story...</div>}>
        <AboutUs />
      </Suspense>

      <Suspense fallback={<div>Loading Seasonal Products...</div>}>
        <FeaturedProducts
          title="Seasonal Specialties"
          subtitle="Limited time offers on fresh seasonal products"
          viewAllLink="/shop"
        />
      </Suspense>

      {/* <section className="py-16 bg-organic-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-6">
            Subscribe to Our Newsletter
          </h2>
          <p className="max-w-xl mx-auto mb-8">
            Join our community to receive updates about seasonal products,
            special offers, and organic living tips.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-foreground"
              required
            />
            <button
              type="submit"
              className="bg-white text-organic-600 hover:bg-organic-50 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Subscribe Now
            </button>
          </form>
        </div>
      </section> */}
    </>
  );
};

export default Home;
