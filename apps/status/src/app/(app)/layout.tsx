import type React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default async function AppLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <>
      <main className="w-full min-h-screen md:min-h-full container mx-auto max-w-3xl p-6">
        <Header />
        {children}
        <Footer />
      </main>
    </>
  );
}
