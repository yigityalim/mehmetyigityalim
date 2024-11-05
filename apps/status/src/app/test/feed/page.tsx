import { Incident } from "@/components/incident";
import { incidentService } from "@/server/services/incident";
import { Button } from "@myy/ui/button";
import { revalidatePath } from "next/cache";
import Form from "next/form";
import { jsx } from "react/jsx-runtime";

export default async function FeedPage() {
	const data = await incidentService.listIncidents({});
	async function handleSubmit() {
		"use server";
		/*
		const response = await incidentService.createIncidentWithEvents({
			title: "API GET sorgusunda hata alınıyor",
			status: "open",
			site_id: 1,
			type: "high",
			priority: "medium",
			assignee: "bu sorunu en kısa sürede çözmemiz gerekiyor",
			events: [
				{
					title: "Hata kaydı oluşturuldu",
					status: "open",
					message: "hatanın çözümü için çalışmalar başlatıldı",
				},
			],
		});
        */
		/*
		const response = await incidentService.addEventsToIncident(2, [
			{
				title: "Olay kaydı güncellendi, olay kapatıldı",
				status: "closed",
				message: "Olay kapatıldı",
			},
		]);*/
		await incidentService.createIncidentWithEvents({
			title: "API PUT sorgusunda hata alınıyor",
			status: "open",
			site_id: 1,
			type: "high",
			priority: "medium",
			assignee: "bu sorunu en kısa sürede çözüme ulaştıracağız.",
			created_at: new Date("2024-10-10"),
			events: [
				{
					title: "Hata kaydı oluşturuldu",
					status: "open",
					message: "hatanın çözümü için çalışmalar başlatıldı",
					created_at: new Date("2024-10-11"),
				},
				{
					title: "Hata kaydı güncellendi",
					status: "update",
					message: "hatanın çözümü için çalışmalar devam ediyor",
					created_at: new Date("2024-10-12"),
				},
				{
					title: "Olay inceleniyor",
					status: "investigating",
					message: "hatanın çözümü için çalışmalar devam ediyor",
					created_at: new Date("2024-10-13"),
				},
				{
					title: "Olay kapatıldı",
					status: "closed",
					message: "hatanın çözümü tamamlandı",
					created_at: new Date("2024-10-14"),
				},
			],
		});
		revalidatePath("/test/feed");
	}

	return (
		<div className="w-full flex flex-col gap-8 p-8 items-start justify-start">
			<Form action={handleSubmit}>
				<Button type="submit">Submit</Button>
			</Form>
			<div className="w-full flex flex-col gap-10 mb-8">
				{data.map((incident) => (
					<Incident incident={incident} key={incident.id} />
				))}
			</div>
		</div>
	);
}
