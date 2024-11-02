import { db, incident } from "@/server/db";
import { incidentService } from "@/server/servies/incident";

export default async function Page() {
	const allIncidents = await incidentService.listIncidents();

	async function addIncident(data: FormData) {
		"use server";
		const newIncidentEvents = await incidentService.addEventsToIncident(9, [
			{
				title: "new event",
				message: "new event message",
				status: "created",
			},
			{
				title: "Araştırılıyor",
				message: "bu hata en kısa sürede giderilecek.",
				status: "created",
			},
		]);

		console.log(newIncidentEvents);
	}

	return (
		<div className="p-8 min-h-dvh flex items-center justify-center flex-col gap-4">
			<form action={addIncident}>
				<button type="submit" className="px-4 py-2 bg-red-500">
					ekle
				</button>
			</form>
			<div className="flex flex-col">
				{allIncidents?.incidents.length ? (
					allIncidents?.incidents.map(async (incident) => {
						const allEvents = await incidentService.getEventsForIncident(
							incident.id,
						);

						return (
							<div key={incident.id} className="flex flex-col gap-2">
								<div>Incident ID: {incident.id}</div>
								<div>Incident Title: {incident.title}</div>
								<div>Incident Status: {incident.status}</div>
								<div>Incident Events:</div>
								<div className="flex flex-col gap-2">
									{allEvents.map((event) => (
										<div key={event.id} className="flex flex-col gap-2">
											<div>Event ID: {event.id}</div>
											<div>Event Title: {event.title}</div>
											<div>Event Message: {event.message}</div>
											<div>Event Status: {event.status}</div>
										</div>
									))}
								</div>
							</div>
						);
					})
				) : (
					<div>burada bir şey yok.</div>
				)}
			</div>
		</div>
	);
}
