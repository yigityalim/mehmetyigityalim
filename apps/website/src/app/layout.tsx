import { cn } from "@myy/ui/cn";
import "@myy/ui/globals.css";
import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactElement } from "react";
import { geistMono, geistSans } from "@myy/ui/font";
import { ThemeProvider } from "@myy/ui/theme";

export const metadata = {
  metadataBase: new URL("https://mehmetyigityalim.com"),
  title: {
    default: "Anasayfa",
    template: "%s | Mehmet Yiğit alım",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
} satisfies Metadata;

export const viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
} satisfies Viewport;

export default function Layout({ children }: { children: ReactElement }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistMono.className,
          geistSans.className,
          "overflow-x-hidden antialiased",
        )}
      >
        <ThemeProvider>
          <main className="container mx-auto overflow-hidden md:overflow-visible">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
