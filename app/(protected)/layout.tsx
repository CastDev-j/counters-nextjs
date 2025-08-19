import { Header } from "@/components/header";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen max-w-screen flex flex-col items-center">
      <Header />

      {children}
    </main>
  );
}
