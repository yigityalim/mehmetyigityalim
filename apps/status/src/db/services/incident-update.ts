// incident-update.ts
import { db } from "@/db/db";
import {
	type IncidentUpdateInsert,
	incident,
	incidentUpdate as incidentUpdateSchema,
} from "@/db/schema";
import { _ } from "@myy/shared";
import { desc, eq } from "drizzle-orm";
import type { MaybePromise, ServiceFunctionReturnType } from "./types";
import { withErrorHandling } from "./utils";

export type IncidentUpdateServiceFunctionReturnType<
	K extends keyof typeof incidentUpdate,
> = ServiceFunctionReturnType<typeof incidentUpdate, K>;

export const incidentUpdate = {
	addIncidentUpdateToIncident,
	getIncidentUpdateById,
	updateIncidentUpdate,
	listIncidentUpdates,
};

export async function addIncidentUpdateToIncident(
	data: Omit<IncidentUpdateInsert, "id" | "incident_id">,
	incidentId: string,
) {
	return withErrorHandling(
		async () =>
			await db.transaction(async (tx) => {
				const [insertedUpdate] = await tx
					.insert(incidentUpdateSchema)
					.values({
						...data,
						incident_id: incidentId,
						created_at: data.created_at ?? new Date(),
						updated_at: new Date(),
					})
					.returning();

				await tx
					.update(incident)
					.set({ status: data.status, updated_at: new Date() })
					.where(eq(incident.id, incidentId));

				if (data.status === "closed") {
					// eğer status closed ise incident'ın çözüm tarihi güncellenir
					await tx
						.update(incident)
						.set({ resolved_at: new Date() })
						.where(eq(incident.id, incidentId));
				}

				return insertedUpdate;
			}),
	);
}

export async function getIncidentUpdateById(id: string) {
	return withErrorHandling(
		async () =>
			await db.query.incidentUpdate.findFirst({
				where: eq(incidentUpdateSchema.id, id),
			}),
	);
}

export async function updateIncidentUpdate(
	id: string,
	data: Partial<IncidentUpdateInsert>,
) {
	const [updatedUpdate] = await db
		.update(incidentUpdateSchema)
		.set({ ...data, updated_at: new Date() })
		.where(eq(incidentUpdateSchema.id, id))
		.returning();
	return withErrorHandling(async () => updatedUpdate);
}

export async function listIncidentUpdates() {
	return withErrorHandling(
		async () =>
			await db.query.incidentUpdate.findMany({
				orderBy: [desc(incidentUpdateSchema.created_at)],
			}),
	);
}
