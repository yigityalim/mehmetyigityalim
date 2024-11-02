import { db } from "../db";
import {
	incident,
	incident_event,
	type IncidentInsert,
	type IncidentEventInsert,
	type IncidentSelect,
	type IncidentEventSelect,
} from "../schema";
import { eq, desc, or, like, sql } from "drizzle-orm";
import crypto from "node:crypto";

interface IncidentWithEvents extends Omit<IncidentInsert, "id"> {
	events: Array<Omit<IncidentEventInsert, "id" | "incident_id" | "hash">>;
}

export class IncidentService {
	async createIncident(data: Omit<IncidentInsert, "id">) {
		const [insertedIncident] = await db
			.insert(incident)
			.values({
				...data,
				created_at: new Date(),
				updated_at: new Date(),
			})
			.returning();

		return insertedIncident;
	}

	async createEvent(
		incidentId: number,
		eventData: Omit<IncidentEventInsert, "id" | "incident_id" | "hash">,
	) {
		const [insertedEvent] = await db
			.insert(incident_event)
			.values({
				incident_id: incidentId,
				hash: crypto.createHash("sha256").update(eventData.title).digest("hex"),
				...eventData,
				created_at: new Date(),
				updated_at: new Date(),
			})
			.returning();

		return insertedEvent;
	}

	async createIncidentWithEvents(data: IncidentWithEvents) {
		return await db.transaction(async (tx) => {
			const [insertedIncident] = await tx
				.insert(incident)
				.values({
					title: data.title,
					status: data.status,
					type: data.type,
					priority: data.priority,
					assignee: data.assignee,
					tags: data.tags,
					created_at: new Date(),
					updated_at: new Date(),
				})
				.returning();

			if (!insertedIncident) {
				return { incident: null, events: [] };
			}

			const events: IncidentEventSelect[] = [];

			for (const event of data.events) {
				const [insertedEvent] = await tx
					.insert(incident_event)
					.values({
						incident_id: insertedIncident.id,
						hash: crypto.createHash("sha256").update(event.title).digest("hex"),
						...event,
						created_at: new Date(),
						updated_at: new Date(),
					})
					.returning();

				events.push(insertedEvent as IncidentEventSelect);
			}

			return { incident: insertedIncident, events };
		});
	}

	async getIncidentById(id: number) {
		const result = await db.transaction(async (tx) => {
			const incidentResult = await tx
				.select()
				.from(incident)
				.where(eq(incident.id, id))
				.limit(1);

			if (incidentResult.length === 0) {
				return null;
			}

			const events = await tx
				.select()
				.from(incident_event)
				.where(eq(incident_event.incident_id, id))
				.orderBy(desc(incident_event.created_at));

			return { incident: incidentResult[0], events };
		});

		return result;
	}

	async updateIncident(
		id: number,
		data: Partial<IncidentInsert>,
	): Promise<IncidentSelect | null> {
		const [updatedIncident] = await db
			.update(incident)
			.set({ ...data, updated_at: new Date() })
			.where(eq(incident.id, id))
			.returning();

		return updatedIncident || null;
	}

	async deleteIncident(id: number): Promise<boolean> {
		return await db.transaction(async (tx) => {
			await tx.delete(incident_event).where(eq(incident_event.incident_id, id));
			const result = await tx.delete(incident).where(eq(incident.id, id));
			return !!result.lastInsertRowid;
		});
	}

	async addEventsToIncident(
		incidentId: number,
		events: Array<Omit<IncidentEventInsert, "id" | "incident_id" | "hash">>,
	): Promise<IncidentEventSelect[]> {
		return await db.transaction(async (tx) => {
			const insertedEvents: IncidentEventSelect[] = [];

			for (const event of events) {
				const [insertedEvent] = await tx
					.insert(incident_event)
					.values({
						incident_id: incidentId,
						hash: crypto.createHash("sha256").update(event.title).digest("hex"),
						...event,
						created_at: new Date(),
						updated_at: new Date(),
					})
					.returning();

				insertedEvents.push(insertedEvent as IncidentEventSelect);
			}

			return insertedEvents;
		});
	}

	async listIncidents(page = 1, pageSize = 10) {
		const offset = (page - 1) * pageSize;

		const incidents = await db
			.select()
			.from(incident)
			.limit(pageSize)
			.offset(offset)
			.orderBy(desc(incident.created_at));

		console.log(incidents);

		if (!incidents) return null;

		const count = await db.$count(incident);

		return { incidents, total: Number(count) };
	}

	async searchIncidents(query: string): Promise<IncidentSelect[]> {
		return await db
			.select()
			.from(incident)
			.where(
				or(
					like(incident.title, `%${query}%`),
					sql`EXISTS (
                        SELECT 1 FROM json_each(${incident.tags})
                        WHERE json_each.value LIKE ${`%${query}%`}
                    )`,
				),
			)
			.orderBy(desc(incident.created_at));
	}

	async filterIncidentsByType(
		type: IncidentInsert["type"],
	): Promise<IncidentSelect[]> {
		return await db
			.select()
			.from(incident)
			.where(eq(incident.type, type))
			.orderBy(desc(incident.created_at));
	}

	async filterIncidentsByPriority(
		priority: IncidentInsert["priority"],
	): Promise<IncidentSelect[]> {
		return await db
			.select()
			.from(incident)
			.where(eq(incident.priority, priority))
			.orderBy(desc(incident.created_at));
	}

	async filterIncidentsByStatus(
		status: IncidentInsert["status"],
	): Promise<IncidentSelect[]> {
		return await db
			.select()
			.from(incident)
			.where(eq(incident.status, status))
			.orderBy(desc(incident.created_at));
	}

	async filterIncidentsByAssignee(
		assignee: IncidentInsert["assignee"],
	): Promise<IncidentSelect[]> {
		return await db
			.select()
			.from(incident)
			.where(eq(incident.assignee, assignee))
			.orderBy(desc(incident.created_at));
	}
	/*
	async filterIncidentsBySite(
		site: IncidentInsert["site"],
	): Promise<IncidentSelect[]> {
		return await db
			.select()
			.from(incident)
			.where(eq(incident.site, site))
			.orderBy(desc(incident.created_at));
	}
            */

	async filterIncidentsByTag(tag: string): Promise<IncidentSelect[]> {
		return await db
			.select()
			.from(incident)
			.where(
				sql`EXISTS (
                    SELECT 1 FROM json_each(${incident.tags})
                    WHERE json_each.value = ${tag}
                )`,
			)
			.orderBy(desc(incident.created_at));
	}

	async getEventsForIncident(
		incidentId: number,
	): Promise<IncidentEventSelect[]> {
		return await db
			.select()
			.from(incident_event)
			.where(eq(incident_event.incident_id, incidentId))
			.orderBy(desc(incident_event.created_at));
	}

	async updateEvent(
		id: number,
		data: Partial<IncidentEventInsert>,
	): Promise<IncidentEventSelect | null> {
		const [updatedEvent] = await db
			.update(incident_event)
			.set({ ...data, updated_at: new Date() })
			.where(eq(incident_event.id, id))
			.returning();

		return updatedEvent || null;
	}

	async deleteEvent(id: number): Promise<boolean> {
		const result = await db
			.delete(incident_event)
			.where(eq(incident_event.id, id));

		return !!result.lastInsertRowid;
	}
}

export const incidentService = new IncidentService();
