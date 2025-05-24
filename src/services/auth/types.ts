
import { Session, User, AuthResponse } from "@supabase/supabase-js";

// Interface for sign-up data
export interface SignUpData {
  email: string;
  password: string;
  name: string;
  metadata?: Record<string, any>;
}

// Interface for login data
export interface LoginData {
  email: string;
  password: string;
}

// Interface for user profile with role
export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  email?: string;
}

export type { Session, User, AuthResponse };
