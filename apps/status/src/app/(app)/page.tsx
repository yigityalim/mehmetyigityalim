import { LatestIncident } from "@/components/latest-incident";
import { Status } from "@/components/status";
import { services } from "@/db/services";
import { format } from "date-fns";
import { Wrench } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function Home() {
	const [incidents, isMaintenance] = await Promise.all([
		services.incident.listIncidents(),
		services.scheduledMaintenance.listScheduledMaintenance(),
	]);

	return (
		<>
			{isMaintenance?.map((maintenance) => (
				<div className="w-full px-4 md:px-0 py-2 " key={maintenance.id}>
					<Link
						href={`/maintenance/${maintenance.id}`}
						className="w-full flex flex-row gap-x-4 items-start justify-start mt-1 p-3 border border-statuspage-neutral-80 dark:border-statuspage-neutral-700 dark:bg-statuspage-neutral-800 rounded text-center font-medium"
					>
						<Wrench className="size-6 shrink-0" />

						<div className="flex flex-col gap-y-1 text-xs">
							<span className="mx-1 text-statuspage-neutral-800 dark:text-white">
								{maintenance.name}
							</span>
							<span className="text-statuspage-neutral-200">
								{format(
									new Date(maintenance.scheduled_start_time),
									"dd/MM/yyyy HH:mm",
								)}
							</span>
						</div>
					</Link>
				</div>
			))}
			<Status />
			<section className="grid grid-cols-1 gap-4 pt-12">
				<Link
					id="latest-incidents"
					href="#latest-incidents"
					className="w-full px-6 md:px-0 pb-4 text-start text-xl font-semibold text-statuspage-neutral-800 dark:text-white"
				>
					Geçmiş Olaylar
				</Link>
				<LatestIncident incidents={incidents} />
			</section>
		</>
	);
}

export const metadata = {
	title: "Status ",
};
