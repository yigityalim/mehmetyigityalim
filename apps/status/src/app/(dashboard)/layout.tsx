import { DashboardHeader } from "@/components/dashboard/header";
import type React from "react";

export default async function DashbordLayout({
	children,
}: Readonly<React.PropsWithChildren>) {
	return (
		<main className="w-full p-4 flex flex-col items-center justify-start gap-2 bg-zinc-100 dark:bg-zinc-950 transition-all">
			<DashboardHeader />
			<div className="flex-1 bg-white dark:bg-zinc-900 w-full p-6 rounded">
				{children}
			</div>
		</main>
	);
}
