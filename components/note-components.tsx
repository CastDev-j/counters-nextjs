"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { getNotes } from "@/app/actions/notes";
import { Note } from "@/lib/interfaces";

export const NoteComponent = () => {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      
      const data  = await getNotes();
      setNotes(data);

      setLoading(false);
    };
    getData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="px-6">
        <h2 className="font-bold text-xl mb-4">Your user details</h2>
        <div className="mb-4">
          <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify({}, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
      <div className="px-6">
        <h2 className="font-bold text-xl mb-4">Your user details</h2>
        <div className="mb-4">
          <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(notes, null, 2)}
          </pre>
        </div>
      </div>
  );
};
