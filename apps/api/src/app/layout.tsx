import type { Metadata } from "next";
import type React from "react";

export const metadata = {
  title: "API",
  description: "mehmetyigityalim projesi için kullanılan ortak API",
} satisfies Metadata;

export default function RootLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
