"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
	const router = useRouter();
	return (
		<button
			className="inline-flex items-center text-[#21242D] dark:text-white px-4 py-2 group"
			onClick={() => router.back()}
		>
			<ArrowLeft className="size-4 group-hover:translate-x-[-2px] transition-transform" />
			<span className="ml-2 group-hover:underline underline-offset-4">
				Geri
			</span>
		</button>
	);
}
