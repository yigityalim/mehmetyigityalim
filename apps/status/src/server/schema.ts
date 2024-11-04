import { sqliteTable } from "drizzle-orm/sqlite-core";
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
				"updated", // sistemsel değişiklik yapıldığında
				"update", // durum değiştiğinde
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
	created_at: c.integer({ mode: "timestamp" }),
	updated_at: c.integer({ mode: "timestamp" }),
	type: c.text({ enum: ["low", "medium", "high"] }).notNull(),
	priority: c.text({ enum: ["low", "medium", "high"] }).notNull(),
	assignee: c.text().notNull(),
	resolved_at: c.integer({ mode: "timestamp" }),
	tags: c.blob({ mode: "json" }).$type<string[]>(),
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
				"updated", // sistemsel değişiklik yapıldığında
				"update", // durum değiştiğinde
				"resolved",
				"closed",
				"investigating",
			],
		})
		.notNull(),
	created_at: c.integer({ mode: "timestamp" }),
	updated_at: c.integer({ mode: "timestamp" }),
}));

export const sites = sqliteTable("sites", (c) => ({
	id: c.integer().primaryKey({ autoIncrement: true }),
	hash: c.text().$defaultFn(() => crypto.createHash("sha256").digest("hex")),
	name: c.text().notNull(),
	url: c.text().notNull(),
	created_at: c.integer({ mode: "timestamp" }),
	updated_at: c.integer({ mode: "timestamp" }),
}));

export type IncidentSelect = typeof incident.$inferSelect;
export type IncidentEventSelect = typeof incident_event.$inferSelect;

export type IncidentInsert = typeof incident.$inferInsert;
export type IncidentEventInsert = typeof incident_event.$inferInsert;

export type IncidentSiteSelect = typeof sites.$inferSelect;
export type IncidentSiteInsert = typeof sites.$inferInsert;
