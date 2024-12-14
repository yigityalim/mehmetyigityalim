import services from "@/server/services";
import { Button } from "@myy/ui/button";
import { addDays } from "date-fns";
import Form from "next/form";

export default async function MaintenanceFeedPage() {
	async function generateMaintenanceMockData() {
		"use server";
		const performance1 = performance.now();

		const now = new Date();
		const twoDays = addDays(now, 2);
		const fiveDays = addDays(now, 5);

		await services.scheduledMaintenance.deleteScheduledMaintenance(
			"2ad62419-87b2-47b8-8beb-de4e7c6a0ae3",
		);

		const site1 = await services.component.getComponentByName(
			"mehmetyigityalim.com",
		);

		const maintenance =
			await services.scheduledMaintenance.createScheduledMaintenance({
				name: "mehmetyigityalim.com sitesinde planlanan bakım.",
				description:
					"planlanan bakım süresi 3 gün olarak tahmin edilmektedir. 2 gün sonra bakım başlayacaktır.",
				status: "scheduled",
				published: true,
				scheduled_start_time: twoDays,
				scheduled_end_time: fiveDays,
				component: site1!.id,
			});

		if (!maintenance) {
			throw new Error("MOCK: Maintenance not found");
		}

		console.log("MOCK: Maintenance created:", maintenance);
	}
	return (
		<Form action={generateMaintenanceMockData}>
			<Button type="submit">Generate Maintenance Mock Data</Button>
		</Form>
	);
}
