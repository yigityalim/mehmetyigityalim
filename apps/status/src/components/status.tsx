import { cn } from "@myy/ui/cn";
import { incidentService } from "@/server/services/incident";
import { ServiceStatus } from "./service-status";
import { IncidentEvent } from "./incident";

export type SiteWithIncidentStatus = Awaited<
	ReturnType<typeof incidentService.listSitesWithIncidentStatus>
>[number];

export async function Status() {
	const [allSites, [lastIncident]] = await Promise.all([
		incidentService.listSitesWithIncidentStatus(),
		incidentService.getLastIncidentsWithEvents(),
	]);

	return (
		<div className="w-full max-w-4xl mx-autoflex flex-col gap-4 items-center justify-start">
			<h1 className="text-3xl font-bold text-center mb-4">Sistem Durumu</h1>

			{lastIncident && (
				<div
					className={cn("w-full rounded-lg border text-center mb-4", {
						"border-green-300 text-green-800 dark:border-green-800 dark:text-green-100":
							lastIncident.status === "resolved",
						"border-red-300 text-red-800 dark:border-red-800 dark:text-red-100":
							lastIncident.status === "closed",
						"border-blue-300 text-blue-800 dark:border-blue-800 dark:text-blue-100":
							lastIncident.status === "investigating",
						"border-purple-300 text-purple-800 dark:border-purple-800 dark:text-purple-100":
							lastIncident.status === "created",
						"border-primary text-primary-foreground":
							lastIncident.status === "update",
					})}
				>
					<div
						className={cn("text-lg font-semibold px-4 py-2 text-start", {
							"bg-yellow-100 dark:bg-yellow-600 text-yellow-500 dark:text-yellow-100":
								lastIncident.status === "open",
							"bg-green-100 dark:bg-green-600 text-green-500":
								lastIncident.status === "resolved",
							"bg-red-100 dark:bg-red-600": lastIncident.status === "closed",
							"bg-blue-100 dark:bg-blue-600 text-blue-500":
								lastIncident.status === "investigating",
							"bg-purple-100 dark:bg-purple-600 text-purple-500":
								lastIncident.status === "created",
							"bg-primary text-primary-foreground":
								lastIncident.status === "update",
						})}
					>
						<span className="mr-2">Son Olay:</span>
						{lastIncident.title}
					</div>
					<div className="w-full text-sm font-normal flex flex-col gap-4 items-start justify-center p-4">
						{lastIncident.events.map((event) => (
							<IncidentEvent key={event.id} event={event} />
						))}
					</div>
				</div>
			)}

			<div className="w-full flex flex-col items-center justify-center">
				{allSites.map((site, index) => (
					<ServiceStatus
						key={site.id}
						site={site}
						daysToShow={30}
						className={cn("border-x border-b", { "border-t": index === 0 })}
					/>
				))}
			</div>
		</div>
	);
}
