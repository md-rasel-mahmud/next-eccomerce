import Image from "next/image";
import React from "react";

const AboutUs = () => {
  return (
    <section className="py-16 bg-earth-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <Image
              src="/placeholder.svg"
              alt="About Organic Harvest"
              className="rounded-lg shadow-md w-full h-auto"
              width={500}
              height={500}
            />
          </div>

          <div>
            <span className="inline-block mb-3 bg-earth-200 text-earth-500 px-3 py-1 rounded-full text-sm font-medium">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Bringing Nature&apos;s Best{" "}
              <span className="text-organic-500">To Your Table</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              At Organic Harvest, we believe in the goodness of nature. Our
              journey began with a simple mission - to make organic, natural
              food accessible to everyone while supporting local farmers and
              sustainable practices.
            </p>
            <p className="text-muted-foreground mb-6">
              Every product in our store is carefully selected, ensuring the
              highest quality and freshness. From sweet mangoes to nutritious
              honey, we bring you the best of organic produce from farm to
              table.
            </p>
            <ul className="space-y-2 mb-6 leaf-bullet">
              <li>100% Certified Organic Products</li>
              <li>Direct Sourcing from Local Farmers</li>
              <li>Eco-friendly Packaging</li>
              <li>Sustainable Farming Practices</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
