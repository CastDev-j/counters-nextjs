"use server";
import { Note } from "@/lib/interfaces";
import { createClient } from "@/lib/supabase/server";

export async function getNotes() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.from("notes").select();
  if (error) {
    throw new Error(error.message);
  }
  return data as Note[];
}
