// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fvhxtssomrxetzaxuvpa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2aHh0c3NvbXJ4ZXR6YXh1dnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNDY0NDksImV4cCI6MjA2MTcyMjQ0OX0.2mA2XSQGQDdrhO8_KrCbmATEfNVOaJiY1OvU5CuMbRU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);