// component.service.ts
import {
	type ComponentGroupSelect,
	type ComponentSelect,
	type IncidentSelect,
	db,
} from "@/server/db";
import { type ComponentInsert, component } from "@/server/schema";
import { services } from "@/server/services/index";
import { asc, eq } from "drizzle-orm";
import type { MaybePromise, ServiceFunctionReturnType } from "./types";
import { withErrorHandling } from "./utils";

export type ComponentServiceFunctionReturnType<
	K extends keyof typeof componentService,
> = ServiceFunctionReturnType<typeof componentService, K>;

export const componentService = {
	createComponent,
	getComponentById,
	getComponentByName,
	updateComponent,
	deleteComponent,
	listComponents,
};

export async function createComponent(data: Omit<ComponentInsert, "id">) {
	return withErrorHandling(async () => {
		const [insertedComponent] = await db
			.insert(component)
			.values({
				...data,
				created_at: new Date(),
				updated_at: new Date(),
			})
			.returning();
		return insertedComponent;
	});
}

export async function getComponentById(id: string) {
	return withErrorHandling(async () =>
		db.query.component.findFirst({
			where: eq(component.id, id),
			with: {
				group: true,
				incidentImpacts: true,
			},
		}),
	);
}

export async function getComponentByName(name: string) {
	return withErrorHandling(async () =>
		db.query.component.findFirst({
			where: eq(component.name, name),
			with: {
				group: true,
				incidentImpacts: true,
			},
		}),
	);
}

export async function updateComponent(
	id: string,
	data: Partial<ComponentInsert>,
) {
	return withErrorHandling(async () => {
		const [updatedComponent] = await db
			.update(component)
			.set({ ...data, updated_at: new Date() })
			.where(eq(component.id, id))
			.returning();
		return updatedComponent;
	});
}

export async function deleteComponent(id: string) {
	withErrorHandling(
		async () => await db.delete(component).where(eq(component.id, id)),
	);
}

export type ListComponentsReturnType = ReturnType<typeof listComponents>;
export async function listComponents() {
	return withErrorHandling(() =>
		db.query.component
			.findMany({
				with: {
					group: true,
				},
				orderBy: [asc(component.order)],
			})
			.then(async (components) => {
				return Promise.all(
					components.map(async (component) => {
						if (!component.id) {
							return { ...component, incidents: [] };
						}

						const incidents = await services.incident.getIncidentHistory(
							component.id,
							new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
							new Date(),
						);

						return { ...component, incidents: incidents || [] };
					}),
				);
			}),
	);
}
