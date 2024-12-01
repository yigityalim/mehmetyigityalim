import type { Metadata } from "next";
import "@myy/ui/globals.css";
import "@/status.css";
import { NuqsAdapter } from "@myy/shared/params";
import { cn } from "@myy/ui/cn";
import { geistMono, geistSans } from "@myy/ui/font";
import { ThemeProvider } from "@myy/ui/theme";
import type React from "react";

export const metadata = {
	title: "mehmetyigityalim status",
	description: "mehmetyigityalim projesinin durum takip programı.",
} satisfies Metadata;

export default function RootLayout({
	children,
}: Readonly<React.PropsWithChildren>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					geistMono.className,
					geistSans.className,
					"antialiased container mx-auto max-w-lg md:max-w-3xl lg:max-w-4xl",
				)}
			>
				<ThemeProvider>
					<NuqsAdapter>{children}</NuqsAdapter>
				</ThemeProvider>
			</body>
		</html>
	);
}
