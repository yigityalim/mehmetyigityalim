// incident.ts
import { db } from "@/db/db";
import {
	type IncidentInsert,
	component,
	incident as incidentSchema,
	incidentImpact,
	incidentUpdate,
} from "@/db/schema";
import { _ } from "@myy/shared";
import { and, desc, eq, gte, inArray, lte } from "drizzle-orm";
import type { ServiceFunctionReturnType } from "./types";
import { withErrorHandling } from "./utils";

export type IncidentServiceFunctionReturnType<
	K extends keyof typeof incident,
> = ServiceFunctionReturnType<typeof incident, K>;

export const incident = {
	createIncidentWithImpacts,
	getIncidentByHash,
	getLastIncident,
	listIncidents,
	updateIncident,
	deleteIncident,
	getIncidentHistory,
};

export async function createIncidentWithImpacts(
	data: Omit<IncidentInsert, "id"> & { message: string },
	componentIds: string[],
) {
	// etkilenen en az bir bileşen olmalıdır
	if (componentIds.length === 0) {
		throw { error: "At least one component must be impacted" };
	}

	// message değeri sadece incidentInsert'te var. incident tablosuna eklenmemesi gerekiyor.
	const incidentData = _.omit(data, "message");

	return withErrorHandling(async () =>
		db.transaction(async (tx) => {
			// incident tablosuna ekle
			const [insertedIncident] = await tx
				.insert(incidentSchema)
				.values({
					...incidentData,
					created_at: data.created_at ?? new Date(),
					updated_at: new Date(),
				})
				.returning();

			if (componentIds.length > 0 && insertedIncident) {
				// ilk güncellemeyi ekle. bu, olayın başlangıcıdır.
				await tx.insert(incidentUpdate).values({
					incident_id: insertedIncident.id,
					status: "detected", // durum: tespit edildi
					title: data.title, // olayın başlangıcı aynı şekilde güncellemenin de başlığı olacak.
					content: data.message,
				});

				// etkilenen bileşenleri ekle
				for (const componentId of componentIds) {
					await tx.insert(incidentImpact).values({
						incident_id: insertedIncident.id,
						component_id: componentId,
						created_at: data.created_at ?? new Date(),
					});
				}
			}

			// etkilenen bileşenlerin durumunu güncelle
			await Promise.all(
				componentIds.map(async (componentId) => {
					const [updatedComponent] = await tx
						.update(component)
						.set({ status: data.impact })
						.where(eq(component.id, componentId))
						.returning();
					return updatedComponent;
				}),
			);

			return insertedIncident;
		}),
	);
}

export async function getLastIncident() {
	return withErrorHandling(
		async () =>
			await db.transaction(async (tx) => {
				const lastIncident = await tx.query.incident.findFirst({
					orderBy: [desc(incidentSchema.created_at)],
					with: {
						updates: true,
						impactedComponents: {
							with: {
								component: true,
							},
						},
					},
				});

				return lastIncident;
			}),
	);
}

export async function listIncidents() {
	if (!((await db.$count(incidentSchema)) > 0)) {
		return [];
	}
	const incidents = await db.query.incident.findMany({
		with: {
			updates: true,
			impactedComponents: {
				with: {
					component: true,
				},
			},
		},
		orderBy: [desc(incidentSchema.created_at)],
	});

	return withErrorHandling(() => incidents);
}

export async function getIncidentByHash(hash: string) {
	return withErrorHandling(async () => {
		return await db.transaction(async (tx) => {
			const incidentSelect = await tx.query.incident.findFirst({
				where: eq(incidentSchema.hash, hash),
				with: {
					updates: true,
					impactedComponents: {
						with: {
							component: true,
						},
					},
				},
			});

			console.log(incidentSelect);

			if (!incidentSelect) {
				return null;
			}

			const impactedComponents = await tx.query.component.findMany({
				with: {
					group: true,
				},
				/*
				where: inArray(
					component.id,
					incidentSelect.impactedComponents.map((i) => i.component_id),
				)
				 */
			});

			return {
				...incidentSelect,
				impactedComponents,
			};
		});
	});
}

export async function updateIncident(
	id: string,
	data: Partial<IncidentInsert>,
) {
	const [updatedIncident] = await db
		.update(incidentSchema)
		.set({ ...data, updated_at: new Date() })
		.where(eq(incidentSchema.id, id))
		.returning();
	return withErrorHandling(async () => updatedIncident);
}

export async function deleteIncident(id: string) {
	withErrorHandling(
		async () => await db.delete(incidentSchema).where(eq(incidentSchema.id, id)),
	);
}

export async function getIncidentHistory(
	componentId: string,
	from: Date,
	to: Date,
) {
	return withErrorHandling(async () =>
		db.transaction(async (tx) => {
			const incidentImpactId = tx
				.select({ id: incidentImpact.incident_id })
				.from(incidentImpact)
				.where(eq(incidentImpact.component_id, componentId));

			// FIXME: check this
			if ((await incidentImpactId).length === 0) {
				return [];
			}

			return tx.query.incident.findMany({
				where: and(
					gte(incidentSchema.created_at, from),
					lte(incidentSchema.created_at, to),
					inArray(incidentSchema.id, incidentImpactId),
				),
				with: {
					updates: true,
					impactedComponents: {
						with: {
							component: true,
						},
					},
				},
				orderBy: [desc(incidentSchema.created_at)],
			});
		}),
	);
}
