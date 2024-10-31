import { SiteHeader } from "@/components/site-header";
import type React from "react";

export default function AppLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
