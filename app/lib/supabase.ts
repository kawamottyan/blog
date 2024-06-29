import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseURL } from "./config";

export const supabase = createClient( supabaseURL, supabaseAnonKey )