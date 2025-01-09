// component-group.ts
import { db } from "@/db/db";
import {
	type ComponentGroupInsert,
	component,
	componentGroup as componentGroupSchema,
} from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import type { MaybePromise, ServiceFunctionReturnType } from "./types";
import { withErrorHandling } from "./utils";

export type ComponentGroupServiceFunctionReturnType<
	K extends keyof typeof componentGroup,
> = ServiceFunctionReturnType<typeof componentGroup, K>;

export const componentGroup = {
	createComponentGroup,
	getComponentGroupById,
	getComponentGroupByName,
	updateComponentGroup,
	deleteComponentGroup,
	listComponentGroups,
	addComponentToGroup,
};

export async function createComponentGroup(
	data: Omit<ComponentGroupInsert, "id">,
) {
	const [insertedGroup] = await db
		.insert(componentGroupSchema)
		.values({ ...data, created_at: new Date(), updated_at: new Date() })
		.returning();
	return withErrorHandling(() => insertedGroup);
}

export async function getComponentGroupById(id: string) {
	return withErrorHandling(() =>
		db.query.componentGroup.findFirst({
			where: eq(componentGroupSchema.id, id),
			with: {
				components: true,
			},
		}),
	);
}

export async function getComponentGroupByName(name: string) {
	return withErrorHandling(() =>
		db.query.componentGroup.findFirst({
			where: eq(componentGroupSchema.name, name),
			with: {
				components: true,
			},
		}),
	);
}

export async function updateComponentGroup(
	id: string,
	data: Partial<ComponentGroupInsert>,
) {
	const [updatedGroup] = await db
		.update(componentGroupSchema)
		.set({ ...data, updated_at: new Date() })
		.where(eq(componentGroupSchema.id, id))
		.returning();
	return withErrorHandling(() => updatedGroup);
}

export async function deleteComponentGroup(id: string) {
	withErrorHandling(
		async () =>
			await db.delete(componentGroupSchema).where(eq(componentGroupSchema.id, id)),
	);
}

export async function listComponentGroups() {
	return withErrorHandling(() =>
		db.query.componentGroup.findMany({
			with: {
				components: true,
			},
			orderBy: [asc(componentGroupSchema.order)],
		}),
	);
}

export async function addComponentToGroup(
	groupId: string,
	componentId: string,
) {
	return withErrorHandling(
		async () =>
			await db.transaction(async (tx) => {
				const group = await tx.query.componentGroup.findFirst({
					where: eq(componentGroupSchema.id, groupId),
					with: {
						components: true,
					},
				});

				if (!group) {
					return;
				}

				await tx
					.update(component)
					.set({ group_id: groupId })
					.where(eq(component.id, componentId));
			}),
	);
}
