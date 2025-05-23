
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xqwmpmsxvhdsscvcmgxi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxd21wbXN4dmhkc3NjdmNtZ3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NDI2NzgsImV4cCI6MjA2MzQxODY3OH0.A6iFFAOa5hNewhFVpEUQotzT9lchU7pvEHsKxSbuyRk";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
