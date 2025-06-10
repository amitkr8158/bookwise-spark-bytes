
// Mock carts data
export const mockCarts = [
  {
    id: "cart-1",
    user_id: "user-1",
    created_at: new Date("2024-02-25"),
    updated_at: new Date("2024-02-28")
  },
  {
    id: "cart-2",
    user_id: "user-2",
    created_at: new Date("2024-02-20"),
    updated_at: new Date("2024-02-28")
  },
  {
    id: "cart-3",
    user_id: "user-3",
    created_at: new Date("2024-02-18"),
    updated_at: new Date("2024-02-28")
  }
];

// Mock cart items data
export const mockCartItems = [
  {
    id: "cart-item-1",
    cart_id: "cart-1",
    book_id: "book-5",
    bundle_id: null,
    quantity: 1,
    created_at: new Date("2024-02-25"),
    updated_at: new Date("2024-02-25")
  },
  {
    id: "cart-item-2",
    cart_id: "cart-1",
    book_id: "book-8",
    bundle_id: null,
    quantity: 1,
    created_at: new Date("2024-02-28"),
    updated_at: new Date("2024-02-28")
  },
  {
    id: "cart-item-3",
    cart_id: "cart-2",
    book_id: null,
    bundle_id: "bundle-3",
    quantity: 1,
    created_at: new Date("2024-02-20"),
    updated_at: new Date("2024-02-20")
  },
  {
    id: "cart-item-4",
    cart_id: "cart-2",
    book_id: "book-3",
    bundle_id: null,
    quantity: 1,
    created_at: new Date("2024-02-27"),
    updated_at: new Date("2024-02-27")
  },
  {
    id: "cart-item-5",
    cart_id: "cart-3",
    book_id: "book-1",
    bundle_id: null,
    quantity: 2,
    created_at: new Date("2024-02-18"),
    updated_at: new Date("2024-02-28")
  }
];
