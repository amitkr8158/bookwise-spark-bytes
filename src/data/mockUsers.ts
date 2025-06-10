
// Test account credentials
export const testAccounts = {
  user: {
    email: "customer@example.com",
    password: "TestPass123!",
    role: "user" as const
  },
  admin: {
    email: "admin@example.com", 
    password: "TestPass123!",
    role: "admin" as const
  },
  controller: {
    email: "controller@example.com",
    password: "TestPass123!",
    role: "controller" as const
  }
};

// Mock user profiles data
export const mockProfiles = [
  {
    id: "user-1",
    email: "customer@example.com",
    full_name: "John Customer",
    role: "user",
    avatar_url: undefined,
    phone: "+1-555-0123",
    address: "123 Main St, City, State 12345",
    date_of_birth: new Date("1990-05-15"),
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-01-15")
  },
  {
    id: "admin-1", 
    email: "admin@example.com",
    full_name: "Admin User",
    role: "admin",
    avatar_url: undefined,
    phone: "+1-555-0456",
    address: "456 Admin Ave, City, State 12345",
    date_of_birth: new Date("1985-03-20"),
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01")
  },
  {
    id: "controller-1",
    email: "controller@example.com", 
    full_name: "Content Controller",
    role: "controller",
    avatar_url: undefined,
    phone: "+1-555-0789",
    address: "789 Control St, City, State 12345",
    date_of_birth: new Date("1988-08-10"),
    created_at: new Date("2024-01-05"),
    updated_at: new Date("2024-01-05")
  },
  {
    id: "user-2",
    email: "jane.reader@example.com",
    full_name: "Jane Reader",
    role: "user",
    avatar_url: undefined,
    phone: "+1-555-0321",
    address: "321 Book Lane, City, State 12345",
    date_of_birth: new Date("1992-12-03"),
    created_at: new Date("2024-02-01"),
    updated_at: new Date("2024-02-01")
  },
  {
    id: "user-3",
    email: "mike.scholar@example.com",
    full_name: "Mike Scholar",
    role: "user", 
    avatar_url: undefined,
    phone: "+1-555-0654",
    address: "654 Study St, City, State 12345",
    date_of_birth: new Date("1987-07-22"),
    created_at: new Date("2024-01-20"),
    updated_at: new Date("2024-01-20")
  }
];

// Mock user preferences
export const mockUserPreferences = [
  {
    user_id: "user-1",
    theme: "light",
    language: "en",
    email_notifications: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-01-15")
  },
  {
    user_id: "admin-1",
    theme: "dark",
    language: "en", 
    email_notifications: true,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01")
  },
  {
    user_id: "controller-1",
    theme: "light",
    language: "en",
    email_notifications: true,
    created_at: new Date("2024-01-05"),
    updated_at: new Date("2024-01-05")
  },
  {
    user_id: "user-2",
    theme: "dark",
    language: "es",
    email_notifications: false,
    created_at: new Date("2024-02-01"),
    updated_at: new Date("2024-02-01")
  },
  {
    user_id: "user-3",
    theme: "light",
    language: "en",
    email_notifications: true,
    created_at: new Date("2024-01-20"),
    updated_at: new Date("2024-01-20")
  }
];
