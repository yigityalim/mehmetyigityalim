// component.ts
import {
	db,
} from "@/db/db";
import { type ComponentInsert, component as componentSchema} from "@/db/schema";
import { services } from "@/db/services/index";
import { asc, eq } from "drizzle-orm";
import type { MaybePromise, ServiceFunctionReturnType } from "./types";
import { withErrorHandling } from "./utils";

export type ComponentServiceFunctionReturnType<
	K extends keyof typeof component,
> = ServiceFunctionReturnType<typeof component, K>;

export const component = {
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
			.insert(componentSchema)
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
			where: eq(componentSchema.id, id),
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
			where: eq(componentSchema.name, name),
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
			.update(componentSchema)
			.set({ ...data, updated_at: new Date() })
			.where(eq(componentSchema.id, id))
			.returning();
		return updatedComponent;
	});
}

export async function deleteComponent(id: string) {
	withErrorHandling(
		async () => await db.delete(componentSchema).where(eq(componentSchema.id, id)),
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
				orderBy: [asc(componentSchema.order)],
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
