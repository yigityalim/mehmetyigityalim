"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
	const pathname = usePathname();
	return (
		<footer className="p-16 md:p-20 mt-10 border-t border-statuspage-neutral-80 dark:border-statuspage-neutral-700 w-full flex items-center justify-between *:shrink-0">
			<Link href="/incidents" className="text-xs text-start px-2 py-1">
				<ArrowLeft className="size-3 inline-block mr-2" />
				{pathname.includes("/incidents") ? "Anasayfa" : "Raporlar Geçmişi"}
			</Link>
			<Link
				href="https://mehmetyigityalim.com"
				className="text-xs text-end px-2 py-1"
			>
				Mehmet Yiğit Yalım
			</Link>
		</footer>
	);
}
