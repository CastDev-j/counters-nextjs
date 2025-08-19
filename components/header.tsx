import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { FiHome, FiFileText } from "react-icons/fi";

export async function Header() {
  const supabase = await createClient();

  // También puedes usar getUser(), aunque será más lento.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  // Función para obtener las iniciales del usuario
  const getUserInitials = (email: string) => {
    return email
      .split("@")[0]
      .split(".")
      .map((name) => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  // Función para obtener el nombre de usuario del email
  const getUserDisplayName = (email: string) => {
    const username = email.split("@")[0];
    return username
      .split(".")
      .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
      .join(" ");
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      <nav className="w-full max-w-6xl mx-auto px-6 h-16">
        <div className="flex justify-between items-center h-full">
          {/* Logo/Brand Section */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <FiFileText className="text-lg text-emerald-600" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900">Notes App</h1>
              <p className="text-xs text-gray-500 -mt-1">Gestión de notas</p>
            </div>
          </div>

          {/* Navigation Links - Solo visible en pantallas medianas y grandes */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <FiHome className="text-sm" />
              Inicio
            </a>
            <a
              href="/notes"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <FiFileText className="text-sm" />
              Mis Notas
            </a>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {user?.email && (
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getUserInitials(user.email)}
                    </span>
                  </div>

                  {/* User Info - Solo visible en pantallas medianas y grandes */}
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {getUserDisplayName(user.email)}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  {/* User Info simplificada para móvil */}
                  <div className="block md:hidden">
                    <p className="text-sm font-medium text-gray-900">
                      ¡Hola, {getUserDisplayName(user.email)}!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <LogoutButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
