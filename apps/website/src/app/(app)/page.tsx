import { ThemeToggle } from "@myy/ui/theme";
import Link from "next/link";
import { Button } from "@myy/ui/button";
import { Container } from "@/components/container";

export const revalidate = 1800;

export default function Page() {
  return (
    <Container title="Projeler">
      <h1 className="text-2xl font-bold">Page</h1>
      <Link href="/page">
        <Button>Page</Button>
      </Link>
      <ThemeToggle />
    </Container>
  );
}
