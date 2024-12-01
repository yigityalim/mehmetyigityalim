import * as mock from "@/mocks/incident";
import { services } from "@/server/services";
import { Button } from "@myy/ui/button";
import { addHours } from "date-fns";
import Form from "next/form";

export default async function FeedPage() {
	async function generateMockData() {
		"use server";
		const performance1 = performance.now();
		try {
			console.log("Generating mock data...");

			const now = new Date();

			const sites = await services.componentGroup.createComponentGroup({
				name: "Siteler",
				order: 1,
			});

			const apis = await services.componentGroup.createComponentGroup({
				name: "API'lar",
				order: 2,
			});

			const services1 = await services.componentGroup.createComponentGroup({
				name: "Hizmetler",
				order: 3,
			});

			await services.component.createComponent({
				name: "mehmetyigityalim.com",
				description: "mehmetyigityalim.com sitesi",
				order: 1,
				group_id: sites!.id,
			});

			await services.component.createComponent({
				name: "status.mehmetyigityalim.com",
				description: "mehmetyigityalim.com sitesi için durum takip uygulaması",
				order: 2,
				group_id: sites!.id,
			});

			await services.component.createComponent({
				name: "app.mehmetyigityalim.com",
				description: "mehmetyigityalim uygulaması",
				order: 3,
				group_id: sites!.id,
			});

			await services.component.createComponent({
				name: "case*.mehmetyigityalim.com",
				description:
					"mehmetyigityalim case yönetim uygulaması. * = 1, 2, 3, 4, ...",
				order: 4,
				group_id: sites!.id,
			});

			await services.component.createComponent({
				name: "api.mehmetyigityalim.com",
				description: "mehmetyigityalim.com sitesi için API",
				order: 1,
				group_id: apis!.id,
			});

			await services.component.createComponent({
				name: "Services",
				description: "mehmetyigityalim.com sitesi için servisler",
				order: 2,
				group_id: services1!.id,
			});

			const site = await services.component.getComponentByName(
				"mehmetyigityalim.com",
			);

			console.log("MOCK: Site 1:", site);

			if (!site || !("id" in site)) {
				throw new Error("MOCK: first site not found!");
			}

			const incident = await services.incident.createIncidentWithImpacts(
				{
					title: "mehmetyigityalim.com sitesinde tahmini kısa süreli kesinti.",
					description:
						"site kesintisi yaşanmaktadır. kısa sürede çözülecektir.",
					impact: "major_outage",
					severity: "critical",
					message: "site kesintisi yaşanmaktadır. kısa sürede çözülecektir.",
					started_at: now,
				},
				[site.id!],
			);

			if (!incident) {
				throw new Error("MOCK: Incident not found");
			}

			console.log("MOCK: Incident created:", incident);

			// investigating
			await services.incidentUpdate.addIncidentUpdateToIncident(
				{
					title: "Olay ilk tespit edildi.",
					status: "investigating",
					content: "Site kesintisinin nedeni araştırılıyor.",
					created_at: addHours(now, 1),
				},
				incident.id,
			);

			// identified
			await services.incidentUpdate.addIncidentUpdateToIncident(
				{
					title: "Sorunun kaynağı belirlendi.",
					status: "identified",
					content:
						"Site kesintisinin kaynağı belirlendi. Çözüm planı üzerinde çalışılıyor.",
					created_at: addHours(now, 2),
				},
				incident.id,
			);

			// resolving
			await services.incidentUpdate.addIncidentUpdateToIncident(
				{
					title: "Çözüm uygulandı.",
					status: "resolving",
					content: "Site kesintisi çözüldü. Site tekrar erişime açıldı.",
					created_at: addHours(now, 3),
				},
				incident.id,
			);

			// monitoring
			await services.incidentUpdate.addIncidentUpdateToIncident(
				{
					title: "Sistem stabil.",
					status: "monitoring",
					content:
						"Site kesintisi çözüldü. Tekrar kesinti yaşanmaması için izleme yapılıyor.",
					created_at: addHours(now, 4),
				},
				incident.id,
			);

			// resolved
			await services.incidentUpdate.addIncidentUpdateToIncident(
				{
					title: "Sistem normal çalışıyor.",
					status: "resolved",
					content: "Site kesintisi çözüldü. Site tekrar erişime açıldı.",
					created_at: addHours(now, 5),
				},
				incident.id,
			);

			// closed
			await services.incidentUpdate.addIncidentUpdateToIncident(
				{
					title: "Olay kapatıldı.",
					status: "closed",
					content: "Site kesintisi çözüldü. Olay kapatıldı.",
					created_at: addHours(now, 6),
				},
				incident.id,
			);
		} catch (error) {
			console.error("MOCK: Error generating mock data:", error);
		} finally {
			const performance2 = performance.now();
			console.log(
				`MOCK: Performance: ${Math.round(performance2 - performance1)}ms`,
			);
		}
	}

	return (
		<div className="w-full flex flex-col gap-8 p-8 items-start justify-start">
			<Form
				action={generateMockData}
				className="w-full flex flex-col gap-4 items-center justify-center"
			>
				<Button type="submit" className="w-full">
					Feed
				</Button>
			</Form>
		</div>
	);
}
