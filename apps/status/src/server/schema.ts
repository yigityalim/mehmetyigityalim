import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

import crypto from "node:crypto";

export const incident = sqliteTable("incident", (c) => ({
	id: c.integer().primaryKey({ autoIncrement: true }),
	hash: c.text().$defaultFn(() => crypto.createHash("sha256").digest("hex")),
	title: c.text().notNull(),
	status: c
		.text({
			enum: [
				"open",
				"created",
				"updated",
				"update",
				"resolved",
				"closed",
				"investigating",
			],
		})
		.notNull()
		.default("open"),
	site_id: c
		.integer()
		.notNull()
		.references(() => sites.id),
	created_at: c
		.integer({ mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updated_at: c
		.integer({ mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	type: c.text({ enum: ["low", "medium", "high"] }).notNull(),
	priority: c.text({ enum: ["low", "medium", "high"] }).notNull(),
	assignee: c.text().notNull(),
	resolved_at: c.integer({ mode: "timestamp" }),
	tags: blob("tags", { mode: "json" }).$type<string[]>(),
}));

export const incidentRelations = relations(incident, ({ one, many }) => ({
	events: many(incident_event),
	site: one(sites, { fields: [incident.site_id], references: [sites.id] }),
}));

export const incident_event = sqliteTable("incident_event", (c) => ({
	id: c.integer().primaryKey({ autoIncrement: true }),
	hash: c.text().$defaultFn(() => crypto.createHash("sha256").digest("hex")),
	incident_id: c
		.integer()
		.notNull()
		.references(() => incident.id),
	title: c.text().notNull(),
	message: c.text().notNull(),
	status: c
		.text({
			enum: [
				"open",
				"created",
				"updated",
				"update",
				"resolved",
				"closed",
				"investigating",
			],
		})
		.notNull(),
	created_at: c
		.integer({ mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updated_at: c
		.integer({ mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
}));

export const incidentEventRelations = relations(incident_event, ({ one }) => ({
	incident: one(incident, {
		fields: [incident_event.incident_id],
		references: [incident.id],
	}),
}));

export const sites = sqliteTable("sites", (c) => ({
	id: c.integer().primaryKey({ autoIncrement: true }),
	hash: c.text().$defaultFn(() => crypto.createHash("sha256").digest("hex")),
	name: c.text().notNull(),
	url: c.text().notNull().unique(),
	created_at: c
		.integer({ mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updated_at: c
		.integer({ mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
}));

export const siteRelations = relations(sites, ({ many }) => ({
	incidents: many(incident),
}));

export type IncidentSelect = typeof incident.$inferSelect;
export type IncidentInsert = typeof incident.$inferInsert;

export type IncidentEventSelect = typeof incident_event.$inferSelect;
export type IncidentEventInsert = typeof incident_event.$inferInsert;

export type IncidentSiteSelect = typeof sites.$inferSelect;
export type IncidentSiteInsert = typeof sites.$inferInsert;
