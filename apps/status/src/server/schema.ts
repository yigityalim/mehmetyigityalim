import { createHash, randomBytes } from "node:crypto";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";
import {
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";
import type { AdapterAccount } from "next-auth/adapters";

const hash = () =>
	createHash("sha256")
		.update(
			`${randomBytes(16).toString("hex")}${Date.now().toString()}-${Math.random()}`,
		)
		.digest("hex");

/**
 * Impact Enum -> Olay Etkisi
 * **Not Monitored**: İzlenmiyor
 * **Unknown**: Bilinmiyor
 * **Degraded Performance**: Performans sorunları
 * **Partial Outage**: Kısmi kesinti
 * **Major Outage**: Büyük kesinti
 * **Maintenance**: Bakım
 * **Operational**: Operasyonel
 */
export const impactEnum = [
	"not_monitored", // İzlenmiyor
	"unknown", // Bilinmiyor
	"degraded_performance", // Performans sorunları
	"partial_outage", // Kısmi kesinti
	"major_outage", // Büyük kesinti
	"maintenance", // Bakım
	"operational", // Operasyonel
] as const;

/**
 * Incident Status Enum -> Olay Durumu
 * **Detected**: Olay ilk tespit edildiğinde bu durum kullanılır. Bu, otomatik sistemler veya manuel raporlama yoluyla olabilir.
 * *Investigating**: Ekip olayı araştırmaya başladığında bu durum kullanılır. Bu aşamada, sorunun kapsamı ve nedeni henüz tam olarak bilinmemektedir.
 * *Identified**: Sorunun kök nedeni belirlendiğinde bu durum kullanılır. Ekip artık sorunu anlamış ve çözüm planı üzerinde çalışmaya başlamıştır.
 * *Resolving**: Ekip aktif olarak sorunu çözmeye çalışırken bu durum kullanılır. Bu, kod değişiklikleri, sistem yapılandırması güncellemeleri veya diğer düzeltici eylemleri içerebilir.
 * *Monitoring**: Çözüm uygulandıktan sonra, ekip sistemin stabil olduğundan emin olmak için izleme yaparken bu durum kullanılır.
 * *Resolved**: Sorun çözüldüğünde ve sistem normal çalışma durumuna döndüğünde bu durum kullanılır.
 * *Closed**: Olay tamamen kapatıldığında, tüm takip işlemleri tamamlandığında ve bir post-mortem analizi yapıldığında bu durum kullanılır.
 */
export const statusEnum = [
	"detected",
	"investigating",
	"identified",
	"resolving",
	"monitoring",
	"resolved",
	"closed",
] as const;

/**
 * Severity Enum
 * **Minor**: Küçük bir sorun, genellikle kullanıcıları etkilemez.
 * **Major**: Orta düzeyde bir sorun, kullanıcıları etkileyebilir.
 * **Critical**: Kritik bir sorun, kullanıcıları ciddi şekilde etkiler.
 */
export const severityEnum = [
	"minor",
	"major",
	"critical",
	"maintenance",
] as const;

/**
 * Component tablosu
 * **Component**: Sisteminizdeki bileşenleri temsil eder. Bu, farklı hizmetleri veya altyapı bileşenlerini kategorize etmenizi sağlar.
 */
export const component = sqliteTable("component", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	hash: text("hash").unique().$defaultFn(hash),
	name: text("name").notNull(), // Adı
	description: text("description"), // Açıklama
	status: text("status", { enum: impactEnum }).notNull().default("operational"), // Durum: operasyonel
	published: integer("published", { mode: "boolean" }).notNull().default(false), // Yayınlandı mı?
	order: integer("order").notNull(), // Sıralama
	group_id: text("group_id").references(() => componentGroup.id), // Grup ID
	created_at: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`), // Oluşturulma tarihi
	updated_at: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`), // Güncellenme tarihi
});

/**
 * Component Group tablosu
 * **ComponentGroup**: Sisteminizdeki bileşen gruplarını temsil eder. Bu, farklı hizmetleri veya altyapı bileşenlerini kategorize etmenizi sağlar.
 */
export const componentGroup = sqliteTable("component_group", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	hash: text("hash").unique().$defaultFn(hash),
	name: text("name").notNull(), // Adı
	order: integer("order").notNull(), // Sıralama
	published: integer("published", { mode: "boolean" }).notNull().default(false), // Yayınlandı mı?
	created_at: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updated_at: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

/**
 * Incident tablosu
 * **Incident**: Olayları yönetmek için kullanılır. Her olayın bir durumu, etkisi ve şiddeti vardır.
 */
export const incident = sqliteTable("incident", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	hash: text("hash").unique().$defaultFn(hash),
	title: text("title").notNull(), // Kullanıcıya gösterilecek açıklayıcı başlık
	slug: text("slug").unique(), // URL'de kullanılacak kısa isim
	description: text("description"),
	visibility: text("visibility", { enum: ["draft", "published", "archived"] })
		.notNull()
		.default("draft"),
	status: text("status", { enum: statusEnum }).notNull().default("detected"), // Olay durumu
	impact: text("impact", { enum: impactEnum }).notNull(), // Etki seviyesi
	severity: text("severity", { enum: severityEnum }).notNull(), // Şiddet
	started_at: integer("started_at", { mode: "timestamp" }).notNull(), // Başlangıç zamanı
	resolved_at: integer("resolved_at", { mode: "timestamp" }), // Çözüm zamanı
	last_update_at: integer("last_update_at", { mode: "timestamp" }), // Son güncelleme zamanı
	created_at: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updated_at: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

/**
 * Incident Update tablosu
 * **IncidentUpdate**: Olay güncellemelerini takip eder. Bu, kullanıcılara olay hakkında düzenli güncellemeler sağlamanıza olanak tanır.
 */
export const incidentUpdate = sqliteTable("incident_update", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	hash: text("hash").unique().$defaultFn(hash),
	incident_id: text("incident_id")
		.notNull()
		.references(() => incident.id),
	published: integer("published", { mode: "boolean" }).notNull().default(false), // Yayınlandı mı?
	status: text("status", { enum: statusEnum }).notNull().default("detected"), // Durum: tespit edildi.
	title: text("title").notNull(),
	content: text("content"),
	created_at: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updated_at: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

/**
 * Scheduled Maintenance tablosu
 * **ScheduledMaintenance**: Planlı bakımları yönetmek için kullanılır. Bu, kullanıcıları gelecekteki bakım çalışmaları hakkında bilgilendirmenizi sağlar.
 *
 * **service-status**: scheduled, in_progress, completed
 * **scheduled_start_time**: Planlanan başlangıç zamanı
 * **scheduled_end_time**: Planlanan bitiş zamanı
 * **actual_start_time**: Gerçekleşen başlangıç zamanı
 * **actual_end_time**: Gerçekleşen bitiş zamanı
 */
export const scheduledMaintenance = sqliteTable("scheduled_maintenance", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	hash: text("hash").unique().$defaultFn(hash),
	name: text("name").notNull(),
	description: text("description"),
	status: text("status", { enum: ["scheduled", "in_progress", "completed"] })
		.notNull()
		.default("scheduled"), // Durum: planlandı
	component: text("component")
		.notNull()
		.references(() => component.id), // Bileşen
	scheduled_start_time: integer("scheduled_start_time", {
		mode: "timestamp",
	}).notNull(), // Planlanan başlangıç zamanı
	published: integer("published", { mode: "boolean" }).notNull().default(false), // Yayınlandı mı?
	scheduled_end_time: integer("scheduled_end_time", {
		mode: "timestamp",
	}).notNull(), // Planlanan bitiş zamanı
	actual_start_time: integer("actual_start_time", { mode: "timestamp" }), // Gerçekleşen başlangıç zamanı
	actual_end_time: integer("actual_end_time", { mode: "timestamp" }), // Gerçekleşen bitiş zamanı
	created_at: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updated_at: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

/**
 * Maintenance Update tablosu
 * **MaintenanceUpdate**: Bakım güncellemelerini takip eder. Bu, kullanıcılara bakım hakkında düzenli güncellemeler sağlamanıza olanak tanır.
 */
export const maintenanceUpdate = sqliteTable("maintenance_update", (c) => ({
	id: integer("id").primaryKey({ autoIncrement: true }),
	hash: text("hash").unique().$defaultFn(hash),
	maintenance_id: text("maintenance_id")
		.notNull()
		.references(() => scheduledMaintenance.id),
	published: integer("published", { mode: "boolean" }).notNull().default(false), // Yayınlandı mı?
	status: text("status", { enum: statusEnum }).notNull().default("detected"), // Durum: tespit edildi.
	title: text("title").notNull(),
	content: text("content"),
	created_at: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updated_at: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
}));

/**
 * Incident Impact tablosu
 * **IncidentImpact**: Olayların hangi bileşenleri etkilediğini izler. Bu, bir olayın sistem üzerindeki etkisini daha iyi anlamanızı sağlar.
 * İlişkili tablolar: Incident, Component
 * İlişkili alanlar: incident_id, component_id
 *
 */
export const incidentImpact = sqliteTable("incident_impact", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	hash: text("hash").unique().$defaultFn(hash),
	incident_id: text("incident_id")
		.notNull()
		.references(() => incident.id),
	component_id: text("component_id")
		.notNull()
		.references(() => component.id),
	created_at: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

// İlişkiler
export const componentRelations = relations(component, ({ one, many }) => ({
	group: one(componentGroup, {
		fields: [component.group_id],
		references: [componentGroup.id],
	}),
	incidentImpacts: many(incidentImpact),
}));

export const componentGroupRelations = relations(
	componentGroup,
	({ many }) => ({
		components: many(component),
	}),
);

export const incidentRelations = relations(incident, ({ many }) => ({
	updates: many(incidentUpdate),
	impactedComponents: many(incidentImpact),
}));

export const incidentUpdateRelations = relations(incidentUpdate, ({ one }) => ({
	incident: one(incident, {
		fields: [incidentUpdate.incident_id],
		references: [incident.id],
	}),
}));

export const incidentImpactRelations = relations(incidentImpact, ({ one }) => ({
	incident: one(incident, {
		fields: [incidentImpact.incident_id],
		references: [incident.id],
	}),
	component: one(component, {
		fields: [incidentImpact.component_id],
		references: [component.id],
	}),
}));

export const scheduledMaintenanceRelations = relations(
	scheduledMaintenance,
	({ many, one }) => ({
		updates: many(maintenanceUpdate),
		component: one(component, {
			fields: [scheduledMaintenance.component],
			references: [component.id],
		}),
	}),
);

export const maintenanceUpdateRelations = relations(
	maintenanceUpdate,
	({ one, many }) => ({
		maintenance: one(scheduledMaintenance, {
			fields: [maintenanceUpdate.maintenance_id],
			references: [scheduledMaintenance.id],
		}),
	}),
);

// Tip tanımlamaları
export type ComponentSelect = typeof component.$inferSelect;
export type ComponentInsert = typeof component.$inferInsert;

export type ComponentGroupSelect = typeof componentGroup.$inferSelect;
export type ComponentGroupInsert = typeof componentGroup.$inferInsert;

export type IncidentSelect = typeof incident.$inferSelect;
export type IncidentInsert = typeof incident.$inferInsert;

export type IncidentUpdateSelect = typeof incidentUpdate.$inferSelect;
export type IncidentUpdateInsert = typeof incidentUpdate.$inferInsert;

export type ScheduledMaintenanceSelect =
	typeof scheduledMaintenance.$inferSelect;
export type ScheduledMaintenanceInsert =
	typeof scheduledMaintenance.$inferInsert;

export type ScheduledMaintenanceUpdateSelect =
	typeof maintenanceUpdate.$inferSelect;
export type ScheduledMaintenanceUpdateInsert =
	typeof maintenanceUpdate.$inferInsert;

export type IncidentImpactSelect = typeof incidentImpact.$inferSelect;
export type IncidentImpactInsert = typeof incidentImpact.$inferInsert;

////////////////////////////////
//							  //
//	     COMPANY SCHEMA       //
//							  //
////////////////////////////////
export const company = sqliteTable("company", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	image_url: text("image_url"),
	created_at: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updated_at: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export const users = sqliteTable("user", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name"),
	email: text("email").unique(),
	emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
	image: text("image"),
	password: text("password"),
});

export const accounts = sqliteTable(
	"account",
	{
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").$type<AdapterAccount>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	}),
);

export const sessions = sqliteTable("session", {
	sessionToken: text("sessionToken").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
	"verificationToken",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
	},
	(verificationToken) => ({
		compositePk: primaryKey({
			columns: [verificationToken.identifier, verificationToken.token],
		}),
	}),
);

export const authenticators = sqliteTable(
	"authenticator",
	{
		credentialID: text("credentialID").notNull().unique(),
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		providerAccountId: text("providerAccountId").notNull(),
		credentialPublicKey: text("credentialPublicKey").notNull(),
		counter: integer("counter").notNull(),
		credentialDeviceType: text("credentialDeviceType").notNull(),
		credentialBackedUp: integer("credentialBackedUp", {
			mode: "boolean",
		}).notNull(),
		transports: text("transports"),
	},
	(authenticator) => ({
		compositePK: primaryKey({
			columns: [authenticator.userId, authenticator.credentialID],
		}),
	}),
);
