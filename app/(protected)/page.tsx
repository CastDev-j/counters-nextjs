import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { NoteComponent } from "@/components/note-components";
import { getNotes } from "../actions/notes";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const notes = await getNotes();

  return (
    <div className="flex flex-col w-screen py-6">
      <section className="px-6">
        <h2>ID usuario</h2>
        <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-40">
          {JSON.stringify(data.claims.sub, null, 2)}
        </pre>
      </section>

      <section className="px-6">
        <h2 className="font-bold text-xl mb-4">Your Server Notes</h2>
        <div className="mb-4">
          <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(notes, null, 2)}
          </pre>
        </div>
      </section>
      <NoteComponent />
      <NoteComponent />
      <div className="px-6">
        <h2 className="font-bold text-xl mb-4">Your user details</h2>
        <div className="mb-4">
          <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(data.claims, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
