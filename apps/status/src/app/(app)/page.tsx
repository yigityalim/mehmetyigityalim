import { IncidentList } from "@/components/incident-list";
import { Status } from "@/components/status";

export default async function Home() {
  return (
    <>
      <Status />
      <section className="grid grid-cols-1 gap-4 pt-12">
        <h1 className="w-full text-start text-3xl font-medium text-zinc-800 dark:text-zinc-200">
          Son paylaşımlar
        </h1>
        <IncidentList />
      </section>
    </>
  );
}

export const metadata = {
  title: "Status ",
};
