import { mockIncidents } from "@/mocks/incident";
import { Incident } from "@/components/incident";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { notFound } from "next/navigation";

export default async function IncidentDatetimePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	if (!id) notFound();
	const incident = mockIncidents.find(
		(incident) => incident.id === Number.parseInt(id),
	);

	if (!incident) notFound();

	return (
		<div className="w-full flex flex-col items-center justify-center mb-10">
			<div className="py-4 border-b border-brand w-full inline-flex items-center justify-start mb-4">
				<h1 className="text-4xl font-bold text-zinc-800 dark:text-zinc-200">
					{format(incident?.created_at.toString() as string, "dd MMM, yyyy", {
						locale: tr,
					})}
				</h1>
			</div>
			{incident ? (
				<Incident isOpen incident={incident} className="text-2xl" />
			) : (
				<p className="text-gray-500/50 text-xs">Bu tarihe ait bir şey yok</p>
			)}
		</div>
	);
}
