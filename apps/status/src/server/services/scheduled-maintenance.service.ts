// scheduled-maintenance.service.ts
import { db } from "@/server/db";
import {
	type ScheduledMaintenanceInsert,
	type ScheduledMaintenanceUpdateInsert,
	maintenanceUpdate,
	scheduledMaintenance,
} from "@/server/schema";
import { and, eq, gte } from "drizzle-orm";
import type { ServiceFunctionReturnType } from "./types";
import { withErrorHandling } from "./utils";

export type ScheduledMaintenanceServiceFunctionReturnType<
	K extends keyof typeof scheduledMaintenanceService,
> = ServiceFunctionReturnType<typeof scheduledMaintenanceService, K>;

export const scheduledMaintenanceService = {
	getScheduledMaintenance,
	getScheduledMaintenanceUpdates,
	listScheduledMaintenance,
	createScheduledMaintenance,
	createUpdateForScheduledMaintenance,
	getUpdateForScheduledMaintenance,
	createScheduledMaintenanceWithComponents,
	updateScheduledMaintenance,
	updateMaintenanceTime,
	deleteScheduledMaintenance,
	isMaintenance,
};

export async function getScheduledMaintenance(id: string) {
	return withErrorHandling(() =>
		db.query.scheduledMaintenance.findFirst({
			with: {
				updates: true,
				component: true,
			},
			where: eq(scheduledMaintenance.id, id),
		}),
	);
}

export async function getScheduledMaintenanceUpdates(id: string) {
	return withErrorHandling(() =>
		db.query.maintenanceUpdate.findMany({
			where: eq(maintenanceUpdate.maintenance_id, id),
		}),
	);
}

export async function listScheduledMaintenance() {
	const now = new Date();
	if (!((await db.$count(scheduledMaintenance)) > 0)) {
		return [];
	}
	return withErrorHandling(() =>
		db.query.scheduledMaintenance.findMany({
			with: {
				updates: true,
				component: true,
			},
			where: and(gte(scheduledMaintenance.scheduled_end_time, now)),
		}),
	);
}

export async function createScheduledMaintenance(
	data: Omit<ScheduledMaintenanceInsert, "id">,
) {
	return withErrorHandling(
		async () =>
			await db.transaction(async (tx) => {
				const [insertedMaintenance] = await tx
					.insert(scheduledMaintenance)
					.values({ ...data, created_at: new Date(), updated_at: new Date() })
					.returning();

				if (!insertedMaintenance) {
					throw new Error("Failed to create scheduled maintenance");
				}

				await tx.insert(maintenanceUpdate).values({
					maintenance_id: insertedMaintenance.id,
					title: "Bakım başladı",
					content: "Bakım başladı.",
					status: "detected",
					created_at: new Date(),
					updated_at: new Date(),
				});

				return insertedMaintenance;
			}),
	);
}

export async function createUpdateForScheduledMaintenance(
	maintenanceId: string,
	data: Omit<ScheduledMaintenanceUpdateInsert, "id" | "maintenance_id">,
) {
	if (!maintenanceId) {
		throw new Error("Maintenance ID is required to create an update");
	}

	const maintenance = await getScheduledMaintenance(maintenanceId);

	if (!maintenance) {
		throw new Error("Maintenance not found");
	}

	const [insertedUpdate] = await db
		.insert(maintenanceUpdate)
		.values({
			...data,
			maintenance_id: maintenance.id,
			created_at: data.created_at ?? new Date(),
			updated_at: new Date(),
		})
		.returning();
	return withErrorHandling(() => insertedUpdate);
}

export async function getUpdateForScheduledMaintenance(id: string) {
	return withErrorHandling(() =>
		db.query.maintenanceUpdate.findFirst({
			where: eq(maintenanceUpdate.id, id),
		}),
	);
}

// Note: There's no maintenanceComponent table in the provided schema
// If you need to associate components with scheduled maintenance, you might want to add this table
// For now, we'll skip the component association part
export async function createScheduledMaintenanceWithComponents(
	data: Omit<ScheduledMaintenanceInsert, "id">,
	componentIds: string[],
) {
	const [insertedMaintenance] = await db
		.insert(scheduledMaintenance)
		.values({ ...data, created_at: new Date(), updated_at: new Date() })
		.returning();

	// TODO: If you add a maintenanceComponent table, you can associate components here
	// TODO: etkilenen komponentler için bir tablo ve bağlayıcı yap.

	return withErrorHandling(async () => insertedMaintenance);
}

export async function updateScheduledMaintenance(
	id: string,
	data: Partial<ScheduledMaintenanceInsert>,
) {
	const [updatedMaintenance] = await db
		.update(scheduledMaintenance)
		.set({ ...data, updated_at: new Date() })
		.where(eq(scheduledMaintenance.id, id))
		.returning();
	return withErrorHandling(() => updatedMaintenance);
}

export async function updateMaintenanceTime(
	id: string,
	startTime: Date,
	endTime: Date,
) {
	const [updatedMaintenance] = await db
		.update(scheduledMaintenance)
		.set({ scheduled_start_time: startTime, scheduled_end_time: endTime })
		.where(eq(scheduledMaintenance.id, id))
		.returning();
	return withErrorHandling(() => updatedMaintenance);
}

export async function deleteScheduledMaintenance(id: string) {
	const deletedMaintenance = await db
		.delete(scheduledMaintenance)
		.where(eq(scheduledMaintenance.id, id));
	return withErrorHandling(() => deletedMaintenance);
}

/**
 * Bakım modunda olup olmadığını döndürür.
 * @example
 * const isMaintenance = await isMaintenance();
 * console.log(isMaintenance);
 */
export async function isMaintenance() {
	return withErrorHandling(
		async () => await db.select().from(scheduledMaintenance),
		/*.where(
					and(
						gte(scheduledMaintenance.scheduled_start_time, new Date()), // bakım zamanı başlangıcı şu andan büyük olanları kontrol eder
						lte(scheduledMaintenance.scheduled_start_time, new Date()), // bakım zamanı başlangıcı şu andan küçük olanları kontrol eder
					),
				), // önümüzdeki 1 hafta içindeki bakım zamanlarını kontrol eder */
	);
}