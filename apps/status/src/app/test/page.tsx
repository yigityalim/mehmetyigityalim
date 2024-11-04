import { incidentService } from "@/server/services/incident";
import { Test } from "./page.client";

export default async function MonthlyIncidentList() {
	const data = await incidentService.listIncidents();

	console.log(data);

	return <Test data={data} />;
}
