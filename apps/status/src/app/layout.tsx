import type { Metadata } from "next";
import "@myy/ui/globals.css";
import { geistMono, geistSans } from "@myy/ui/font";
import type React from "react";
import { cn } from "@myy/ui/cn";
import { ThemeProvider } from "@myy/ui/theme";

export const metadata = {
	title: "STATUS",
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
					"antialiased container mx-auto max-w-lg",
				)}
			>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
