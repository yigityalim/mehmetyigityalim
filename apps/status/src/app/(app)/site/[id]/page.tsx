import { ServiceStatus } from "@/components/service-status";
import { incidentService } from "@/server/services/incident";
import { notFound } from "next/navigation";
import React from "react";

export default async function Site({
	params,
}: { params: Promise<{ id: number }> }) {
	// FIXME - use Promise.all([params, incidentService.getSiteById(id)]) instead
	const { id } = await params;
	const site =
		(await incidentService.listSiteWithIncidentStatus(id)) ?? notFound();

	return (
		<React.Suspense>
			<div className="w-full flex flex-col gap-4 items-center justify-center">
				<h1 className="w-full text-2xl font-bold text-start mb-4">
					{site.name}
				</h1>
				<ServiceStatus
					site={site}
					daysToShow={30}
					className="p-0"
					hideSiteName
				/>
			</div>
		</React.Suspense>
	);
}
