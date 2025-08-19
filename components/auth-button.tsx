import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  // También puedes usar getUser(), aunque será más lento.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return (
    <div className="flex justify-between w-full items-center gap-4">
      <p>¡Hola, {user?.email}!</p>
      <LogoutButton />
    </div>
  );
}
