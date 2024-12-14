"use client";

import { Incident } from "@/components/incident";
import type { IncidentServiceFunctionReturnType } from "@/server/services";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import React from "react";

type LatestIncidentProps = {
	incidents: IncidentServiceFunctionReturnType<"listIncidents">;
	hideIncidentUpdates?: boolean;
};

export function LatestIncident({
	incidents,
	hideIncidentUpdates = false,
}: Readonly<LatestIncidentProps>) {
	// En sonki olayı bul
	const latestIncident = React.useMemo(() => {
		if (!incidents || incidents.length === 0) return null;
		return incidents.reduce((latest, current) => {
			const latestDate = new Date(latest.created_at as Date);
			const currentDate = new Date(current.created_at as Date);
			return currentDate > latestDate ? current : latest;
		});
	}, [incidents]);

	if (!latestIncident) {
		return (
			<p className="text-muted-foreground pl-5">Olay kaydı bulunmamaktadır.</p>
		);
	}

	// En sonki olayın tarihini al
	const latestDate = new Date(latestIncident.created_at as Date);

	return (
		<div className="w-full">
			<h4 className="text-sm font-semibold mb-4 border-b px-5 md:px-0 border-b-statuspage-neutral-80 pb-2 text-statuspage-neutral-200 dark:border-statuspage-neutral-700">
				{format(latestDate, "d MMM, yyyy", { locale: tr })} - En Son Olay
			</h4>
			<div className="w-full px-5">
				<Incident incident={latestIncident} />
			</div>
		</div>
	);
}
