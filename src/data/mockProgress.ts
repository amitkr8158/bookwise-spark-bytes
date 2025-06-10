
// Mock reading progress data
export const mockReadingProgress = [
  {
    id: "progress-1",
    user_id: "user-1",
    book_id: "book-1",
    page_number: 120,
    percentage: 37.5,
    last_read_at: new Date("2024-02-25")
  },
  {
    id: "progress-2",
    user_id: "user-1",
    book_id: "book-3",
    page_number: 250,
    percentage: 100,
    last_read_at: new Date("2024-02-20")
  },
  {
    id: "progress-3",
    user_id: "user-1",
    book_id: "book-7",
    page_number: 45,
    percentage: 20.5,
    last_read_at: new Date("2024-02-28")
  },
  {
    id: "progress-4",
    user_id: "user-2",
    book_id: "book-1",
    page_number: 280,
    percentage: 87.5,
    last_read_at: new Date("2024-02-26")
  },
  {
    id: "progress-5",
    user_id: "user-2",
    book_id: "book-4",
    page_number: 150,
    percentage: 33.3,
    last_read_at: new Date("2024-02-27")
  },
  {
    id: "progress-6",
    user_id: "user-3",
    book_id: "book-2",
    page_number: 280,
    percentage: 100,
    last_read_at: new Date("2024-02-18")
  },
  {
    id: "progress-7",
    user_id: "user-3",
    book_id: "book-8",
    page_number: 200,
    percentage: 50,
    last_read_at: new Date("2024-02-28")
  }
];

// Mock bookmarks data
export const mockBookmarks = [
  {
    id: "bookmark-1",
    user_id: "user-1",
    book_id: "book-1",
    page_number: 95,
    note: "Great character development here - really shows the protagonist's growth",
    created_at: new Date("2024-02-20"),
    updated_at: new Date("2024-02-20")
  },
  {
    id: "bookmark-2",
    user_id: "user-1",
    book_id: "book-1",
    page_number: 156,
    note: "Plot twist! Did not see this coming at all",
    created_at: new Date("2024-02-22"),
    updated_at: new Date("2024-02-22")
  },
  {
    id: "bookmark-3",
    user_id: "user-2",
    book_id: "book-4",
    page_number: 78,
    note: "Fascinating technology concept - need to research this further",
    created_at: new Date("2024-02-25"),
    updated_at: new Date("2024-02-25")
  },
  {
    id: "bookmark-4",
    user_id: "user-3",
    book_id: "book-2",
    page_number: 145,
    note: "Important strategy for digital transformation - implement in our company",
    created_at: new Date("2024-02-10"),
    updated_at: new Date("2024-02-10")
  },
  {
    id: "bookmark-5",
    user_id: "user-3",
    book_id: "book-8",
    page_number: 89,
    note: "Key principle of quantum mechanics explained clearly",
    created_at: new Date("2024-02-28"),
    updated_at: new Date("2024-02-28")
  }
];
