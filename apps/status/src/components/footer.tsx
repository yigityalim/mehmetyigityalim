"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  return (
    <footer className="pt-10 pb-20 mt-auto border-t border-brand w-full flex items-center justify-between">
      <Link
        href={pathname === "/history" ? "/" : "/history"}
        className="w-full text-xs text-brand"
      >
        <ArrowLeft className="size-3 inline-block mr-2" />{pathname === "/history" ? "Anasayfa" : "Raporlar Geçmişi"}
      </Link>
      <Link href="#" className="w-full text-xs text-end">
        Mehmet Yiğit Yalım
      </Link>
    </footer>
  );
}
