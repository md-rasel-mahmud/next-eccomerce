import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-organic-50 pt-16 pb-10 border-t border-organic-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-bold">
              Organic<span className="text-earth-500">Harvest</span>
            </h3>
            <p className="text-muted-foreground">
              Bringing nature&#39;s best organic foods directly from farms to
              your table. Taste the difference of pure, natural goodness.
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg font-medium mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-organic-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-organic-600 transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-organic-600 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-organic-600 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-organic-600 transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-medium mb-4">
              Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/categories/fruits"
                  className="text-muted-foreground hover:text-organic-600 transition-colors"
                >
                  Fruits
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/sweeteners"
                  className="text-muted-foreground hover:text-organic-600 transition-colors"
                >
                  Sweeteners
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/grains"
                  className="text-muted-foreground hover:text-organic-600 transition-colors"
                >
                  Grains
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/oils"
                  className="text-muted-foreground hover:text-organic-600 transition-colors"
                >
                  Oils
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/spices"
                  className="text-muted-foreground hover:text-organic-600 transition-colors"
                >
                  Spices
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-medium mb-4">
              Contact Info
            </h4>
            <address className="not-italic space-y-2 text-muted-foreground">
              <p>123 Organic Lane, Nature Valley</p>
              <p>Green City, GC 12345</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Email: info@organicharvest.com</p>
            </address>
            <div className="mt-4">
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg border border-organic-200 focus:outline-none focus:border-organic-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-organic-500 hover:bg-organic-600 text-white px-3 py-2 rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-organic-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Organic Harvest. All rights
            reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-organic-600 transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-organic-600 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-organic-600 transition-colors"
                >
                  Sitemap
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
