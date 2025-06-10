
// Mock bundles data
export const mockBundles = [
  {
    id: "bundle-1",
    title: "Adventure Collection",
    description: "A collection of thrilling adventure books that will keep you on the edge of your seat",
    price: 39.99,
    cover_image: "/placeholder.svg",
    is_active: true,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01")
  },
  {
    id: "bundle-2",
    title: "Business Essentials",
    description: "Everything you need to know about modern business and digital transformation",
    price: 29.99,
    cover_image: "/placeholder.svg",
    is_active: true,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01")
  },
  {
    id: "bundle-3",
    title: "Science & Technology",
    description: "Explore the wonders of science and cutting-edge technology",
    price: 49.99,
    cover_image: "/placeholder.svg",
    is_active: true,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01")
  },
  {
    id: "bundle-4",
    title: "Personal Development",
    description: "Transform your life with these self-improvement guides",
    price: 35.99,
    cover_image: "/placeholder.svg",
    is_active: false,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01")
  }
];

// Mock bundle books relationships
export const mockBundleBooks = [
  {
    bundle_id: "bundle-1",
    book_id: "book-1",
    created_at: new Date("2024-01-01")
  },
  {
    bundle_id: "bundle-1", 
    book_id: "book-3",
    created_at: new Date("2024-01-01")
  },
  {
    bundle_id: "bundle-1",
    book_id: "book-4",
    created_at: new Date("2024-01-01")
  },
  {
    bundle_id: "bundle-2",
    book_id: "book-2",
    created_at: new Date("2024-01-01")
  },
  {
    bundle_id: "bundle-3",
    book_id: "book-4",
    created_at: new Date("2024-01-01")
  },
  {
    bundle_id: "bundle-3",
    book_id: "book-8",
    created_at: new Date("2024-01-01")
  },
  {
    bundle_id: "bundle-4",
    book_id: "book-7",
    created_at: new Date("2024-01-01")
  }
];

// Mock bundle purchases
export const mockBundlePurchases = [
  {
    id: "bundle-purchase-1",
    user_id: "user-1",
    bundle_id: "bundle-1",
    purchase_date: new Date("2024-02-01")
  },
  {
    id: "bundle-purchase-2",
    user_id: "user-2",
    bundle_id: "bundle-2",
    purchase_date: new Date("2024-02-05")
  },
  {
    id: "bundle-purchase-3",
    user_id: "user-3",
    bundle_id: "bundle-3",
    purchase_date: new Date("2024-02-10")
  }
];
