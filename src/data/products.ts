import { Product } from "../types/types";

const today = new Date().toISOString();

export const products: Product[] = [
  {
    id: "1",
    name: "Khejurer Gur (Date Molasses)",
    slug: "khejurer-gur",
    description:
      "Pure organic date molasses harvested from the Sundarbans region. Rich in iron and natural sweetness, perfect for desserts and traditional recipes.",
    price: 12.99,
    images: ["/placeholder.svg"],
    category: "Sweeteners",
    tags: ["organic", "natural", "sweetener"],
    featured: true,
    seasonal: true,
    inStock: true,
    stockQuantity: 50,
    rating: 4.8,
    createdAt: today,
    updatedAt: today,
  },
  {
    id: "2",
    name: "Organic Honey",
    slug: "organic-honey",
    description:
      "Raw, unfiltered honey collected from organic flowers. Free from additives and preservatives, this honey retains all its natural enzymes and antioxidants.",
    price: 18.99,
    images: ["/placeholder.svg"],
    category: "Sweeteners",
    tags: ["organic", "raw", "honey"],
    featured: true,
    seasonal: false,
    inStock: true,
    stockQuantity: 35,
    rating: 4.9,
    createdAt: today,
    updatedAt: today,
  },
  {
    id: "3",
    name: "Fresh Mangoes (Himsagar)",
    slug: "fresh-mangoes-himsagar",
    description:
      "Sweet and juicy Himsagar mangoes, freshly harvested from organic farms. These mangoes are known for their unique aroma and rich flavor.",
    price: 15.99,
    salePrice: 13.99,
    images: ["/placeholder.svg"],
    category: "Fruits",
    tags: ["organic", "seasonal", "fruit"],
    featured: true,
    seasonal: true,
    inStock: true,
    stockQuantity: 20,
    rating: 4.7,
    createdAt: today,
    updatedAt: today,
  },
  {
    id: "4",
    name: "Fresh Lychee",
    slug: "fresh-lychee",
    description:
      "Sweet and aromatic lychees harvested at peak ripeness. These juicy fruits are a perfect summer treat, rich in vitamin C and antioxidants.",
    price: 14.99,
    images: ["/placeholder.svg"],
    category: "Fruits",
    tags: ["organic", "seasonal", "fruit"],
    featured: false,
    seasonal: true,
    inStock: true,
    stockQuantity: 15,
    rating: 4.6,
    createdAt: today,
    updatedAt: today,
  },
  {
    id: "5",
    name: "Organic Rice (Kataribhog)",
    slug: "organic-rice-kataribhog",
    description:
      "Aromatic Kataribhog rice grown using traditional organic farming methods. Known for its distinctive aroma and taste that enhances any rice dish.",
    price: 9.99,
    images: ["/placeholder.svg"],
    category: "Grains",
    tags: ["organic", "grain", "staple"],
    featured: false,
    seasonal: false,
    inStock: true,
    stockQuantity: 100,
    rating: 4.5,
    createdAt: today,
    updatedAt: today,
  },
  {
    id: "6",
    name: "Coconut Oil (Cold Pressed)",
    slug: "coconut-oil-cold-pressed",
    description:
      "Pure cold-pressed coconut oil extracted without heat to preserve all its natural goodness. Perfect for cooking, skincare, and hair care.",
    price: 16.99,
    salePrice: 14.99,
    images: ["/placeholder.svg"],
    category: "Oils",
    tags: ["organic", "oil", "natural"],
    featured: true,
    seasonal: false,
    inStock: true,
    stockQuantity: 45,
    rating: 4.8,
    createdAt: today,
    updatedAt: today,
  },
  {
    id: "7",
    name: "Fresh Jackfruit",
    slug: "fresh-jackfruit",
    description:
      "Ripe and sweet jackfruit, known as the 'meat of the fruit world' for its unique texture. Rich in fiber and antioxidants.",
    price: 19.99,
    images: ["/placeholder.svg"],
    category: "Fruits",
    tags: ["organic", "seasonal", "fruit"],
    featured: false,
    seasonal: true,
    inStock: true,
    stockQuantity: 10,
    rating: 4.4,
    createdAt: today,
    updatedAt: today,
  },
  {
    id: "8",
    name: "Organic Mustard Oil",
    slug: "organic-mustard-oil",
    description:
      "Traditional cold-pressed mustard oil made from organically grown mustard seeds. Rich in monounsaturated fatty acids and has a distinctive pungent flavor.",
    price: 11.99,
    images: ["/placeholder.svg"],
    category: "Oils",
    tags: ["organic", "oil", "natural"],
    featured: false,
    seasonal: false,
    inStock: true,
    stockQuantity: 60,
    rating: 4.6,
    createdAt: today,
    updatedAt: today,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured);
}

export function getSeasonalProducts(): Product[] {
  return products.filter((product) => product.seasonal);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );
}
