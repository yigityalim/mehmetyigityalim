import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import type React from "react";

export default async function AppLayout({
	children,
}: Readonly<React.PropsWithChildren>) {
	return (
		<main className="w-full">
			<div className="w-full container mx-auto">
				<Header />
				<div className="h-[calc(50px+50px)] md:h-[calc(50px+60px)]" />
				{children}
			</div>
			<Footer />
		</main>
	);
}
