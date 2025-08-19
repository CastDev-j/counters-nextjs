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

export async function addNote(note: Partial<Note>) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("notes").insert(note).select();
  if (error) {
    throw new Error(error.message);
  }

  return data[0] as Note;
}

export async function deleteNote(id: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .select();
  if (error) {
    throw new Error(error.message);
  }

  return data[0] as Note;
}

export async function updateNote(id: number, updates: Partial<Note>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notes")
    .update(updates)
    .eq("id", id)
    .select();
  if (error) {
    throw new Error(error.message);
  }

  return data[0] as Note;
}
