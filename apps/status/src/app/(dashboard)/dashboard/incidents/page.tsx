import services from "@/db/services";
import { buttonVariants } from "@myy/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function IncidentsPage() {
	const allIncidents = await services.incident.listIncidents();
	return (
		<div className="max-w-7xl mx-auto p-6 lg:p-12">
			<div className="flex items-center justify-between mb-10" />
			<div className="mb-10 flex flex-col space-y-6 md:space-y-0 md:flex-row md:items-center md:justify-between">
				<div>
					<h2 className="text-2xl leading-6 font-medium text-gray-900 dark:text-zinc-200">
						Olaylar
					</h2>
					<p className="mt-2 max-w-4xl text-sm text-zinc-700 dark:text-zinc-400">
						Analiz yapın, işbirliği yapın ve olayları çözün
					</p>
				</div>
				<div className="flex items-center justify-between">
					<Link
						className={buttonVariants({ variant: "outline" })}
						href="/dashboard/incidents/create"
					>
						<Plus size={16} className="mr-2" />
						<span>Olay yarat</span>
					</Link>
				</div>
				{!!allIncidents?.length && (
					<div className="flex flex-col gap-4 items-center justify-start mt-10">
						<h1 className="text-2xl font-semibold text-gray-900 dark:text-zinc-200">
							Incidents
						</h1>
						<React.Suspense fallback={null}>
							<div className="mt-2 max-w-4xl text-sm text-zinc-700 dark:text-zinc-400">
								{allIncidents.map((incident) => (
									<div key={incident.id}>
										<p>{incident.title}</p>
									</div>
								))}
							</div>
						</React.Suspense>
					</div>
				)}
			</div>
		</div>
	);
}
