import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { NotesCrud } from "@/components/notes-crud";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col w-screen p-6 gap-3">
      <section>
        <h2>ID usuario</h2>
        <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-40">
          {JSON.stringify(data.claims.sub, null, 2)}
        </pre>
      </section>

      <NotesCrud />

      <div>
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
