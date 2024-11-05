"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
	const pathname = usePathname();
	return (
		<footer className="pb-20 mt-10 pt-5 border-t border-brand w-full flex items-center justify-between">
			<Link
				href={pathname.includes("/history") ? "/" : "/history"}
				className="w-full text-xs text-brand"
			>
				<ArrowLeft className="size-3 inline-block mr-2" />
				{pathname.includes("/history") ? "Anasayfa" : "Raporlar Geçmişi"}
			</Link>
			<Link
				href="https://mehmetyigityalim.com"
				className="w-full text-xs text-end"
			>
				Mehmet Yiğit Yalım
			</Link>
		</footer>
	);
}
