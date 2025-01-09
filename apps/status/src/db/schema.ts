import { relations, sql } from "drizzle-orm";
import {
	integer,
	primaryKey,
	sqliteTable,
	text,
	index,
	uniqueIndex
} from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

/**
 * Yardımcı fonksiyonlar ve sabitler
 */
const id = text().primaryKey().$defaultFn(() => createId());
const hash = text().$defaultFn(() => createId());
const created_at = integer('created_at', { mode: 'timestamp' })
	.notNull()
	.default(sql`(unixepoch())`)
const updated_at = integer("updated_at", { mode: 'timestamp' })
	.notNull()
	.default(sql`(unixepoch())`)


/**
 * Impact Enum -> Olay Etkisi <br />
 * **Not Monitored**: İzlenmiyor <br />
 * **Unknown**: Bilinmiyor <br />
 * **Degraded Performance**: Performans sorunları <br />
 * **Partial Outage**: Kısmi kesinti <br />
 * **Major Outage**: Büyük kesinti <br />
 * **Maintenance**: Bakım <br />
 * **Operational**: Operasyonel <br />
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
 * Incident Status Enum -> Olay Durumu  <br />
 * **Detected**: Olay ilk tespit edildiğinde bu durum kullanılır. Bu, otomatik sistemler veya manuel raporlama yoluyla olabilir.  <br />
 * *Investigating**: Ekip olayı araştırmaya başladığında bu durum kullanılır. Bu aşamada, sorunun kapsamı ve nedeni henüz tam olarak bilinmemektedir.  <br />
 * *Identified**: Sorunun kök nedeni belirlendiğinde bu durum kullanılır. Ekip artık sorunu anlamış ve çözüm planı üzerinde çalışmaya başlamıştır.  <br />
 * *Resolving**: Ekip aktif olarak sorunu çözmeye çalışırken bu durum kullanılır. Bu, kod değişiklikleri, sistem yapılandırması güncellemeleri veya diğer düzeltici eylemleri içerebilir.  <br />
 * *Monitoring**: Çözüm uygulandıktan sonra, ekip sistemin stabil olduğundan emin olmak için izleme yaparken bu durum kullanılır.  <br />
 * *Resolved**: Sorun çözüldüğünde ve sistem normal çalışma durumuna döndüğünde bu durum kullanılır.  <br />
 * *Closed**: Olay tamamen kapatıldığında, tüm takip işlemleri tamamlandığında ve bir post-mortem analizi yapıldığında bu durum kullanılır.  <br />
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
 * Severity Enum <br />
 * **Minor**: Küçük bir sorun, genellikle kullanıcıları etkilemez. <br />
 * **Major**: Orta düzeyde bir sorun, kullanıcıları etkileyebilir. <br />
 * **Critical**: Kritik bir sorun, kullanıcıları ciddi şekilde etkiler. <br />
 */
export const severityEnum = [
	"minor",
	"major",
	"critical",
	"maintenance",
] as const;

/**
 * Component tablosu <br />
 * **Component**: Sisteminizdeki bileşenleri temsil eder. Bu, farklı hizmetleri veya altyapı bileşenlerini kategorize etmenizi sağlar.
 */
export const component = sqliteTable("component", {
	id,
	hash,
	name: text("name").notNull(), // Adı
	description: text("description"), // Açıklama
	status: text("status", { enum: impactEnum }).notNull().default("operational"), // Durum: operasyonel
	published: integer("published", { mode: "boolean" }).notNull().default(false), // Yayınlandı mı?
	order: integer("order").notNull(), // Sıralama
	group_id: text("group_id").references(() => componentGroup.id), // Grup ID
	created_at, // Oluşturulma tarihi
	updated_at
});

/**
 * Component Group tablosu <br />
 * **ComponentGroup**: Sisteminizdeki bileşen gruplarını temsil eder. Bu, farklı hizmetleri veya altyapı bileşenlerini kategorize etmenizi sağlar.
 */
export const componentGroup = sqliteTable("component_group", {
	id,
	hash,
	name: text("name").notNull(), // Adı
	order: integer("order").notNull(), // Sıralama
	published: integer("published", { mode: "boolean" }).notNull().default(false), // Yayınlandı mı?
	created_at,
	updated_at,
});

/**
 * Incident tablosu <br />
 * **Incident**: Olayları yönetmek için kullanılır. Her olayın bir durumu, etkisi ve şiddeti vardır.
 */
export const incident = sqliteTable("incident", {
	id,
	hash,
	title: text("title").notNull(), // Kullanıcıya gösterilecek açıklayıcı başlık
	slug: text("slug").unique(), // URL'de kullanılacak kısa isim
	description: text("description"),
	visibility: text("visibility", { enum: ["draft", "published", "archived"] })
		.notNull()
		.default("draft"),
	status: text("status", { enum: statusEnum }).notNull().default("detected"), // Olay durumu
	impact: text("impact", { enum: impactEnum }).notNull().default("operational"), // Etki seviyesi
	severity: text("severity", { enum: severityEnum }).notNull().default("minor"), // Şiddet
	started_at: integer("started_at", { mode: "timestamp" }).notNull(), // Başlangıç zamanı
	resolved_at: integer("resolved_at", { mode: "timestamp" }), // Çözüm zamanı
	last_update_at: integer("last_update_at", { mode: "timestamp" }), // Son güncelleme zamanı
	created_at,
	updated_at,
});

/**
 * Incident Update tablosu <br />
 * **IncidentUpdate**: Olay güncellemelerini takip eder. Bu, kullanıcılara olay hakkında düzenli güncellemeler sağlamanıza olanak tanır.
 */
export const incidentUpdate = sqliteTable("incident_update", {
	id,
	hash,
	incident_id: text("incident_id")
		.notNull()
		.references(() => incident.id),
	published: integer("published", { mode: "boolean" }).notNull().default(false), // Yayınlandı mı?
	status: text("status", { enum: statusEnum }).notNull().default("detected"), // Durum: tespit edildi.
	title: text("title").notNull(),
	content: text("content"),
	created_at,
	updated_at,
});

/**
 * Scheduled Maintenance tablosu <br />
 * **ScheduledMaintenance**: Planlı bakımları yönetmek için kullanılır. Bu, kullanıcıları gelecekteki bakım çalışmaları hakkında bilgilendirmenizi sağlar. <br />
 *
 * **service-status**: scheduled, in_progress, completed <br />
 * **scheduled_start_time**: Planlanan başlangıç zamanı <br />
 * **scheduled_end_time**: Planlanan bitiş zamanı <br />
 * **actual_start_time**: Gerçekleşen başlangıç zamanı <br />
 * **actual_end_time**: Gerçekleşen bitiş zamanı <br />
 */
export const scheduledMaintenance = sqliteTable("scheduled_maintenance", {
	id,
	hash,
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
	created_at,
	updated_at,
});

/**
 * Maintenance Update tablosu <br />
 * **MaintenanceUpdate**: Bakım güncellemelerini takip eder. Bu, kullanıcılara bakım hakkında düzenli güncellemeler sağlamanıza olanak tanır.
 */
export const maintenanceUpdate = sqliteTable("maintenance_update", (c) => ({
	id,
	hash,
	maintenance_id: text("maintenance_id")
		.notNull()
		.references(() => scheduledMaintenance.id),
	published: integer("published", { mode: "boolean" }).notNull().default(false), // Yayınlandı mı?
	status: text("status", { enum: statusEnum }).notNull().default("detected"), // Durum: tespit edildi.
	title: text("title").notNull(),
	content: text("content"),
	created_at,
	updated_at,
}));

/**
 * Incident Impact tablosu <br />
 * **IncidentImpact**: Olayların hangi bileşenleri etkilediğini izler. Bu, bir olayın sistem üzerindeki etkisini daha iyi anlamanızı sağlar. <br />
 * İlişkili tablolar: Incident, Component <br />
 * İlişkili alanlar: incident_id, component_id <br />
 *
 */
export const incidentImpact = sqliteTable("incident_impact", {
	id,
	hash,
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
//	     USER SCHEMAS         //
//							  //
////////////////////////////////

export const users = sqliteTable(
	"users",
	{
		id,
		name: text("name").notNull(),
		email: text("email").notNull().unique(),
		emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
		image: text("image"),
		apiKey: text("api_key")
			.notNull()
			.unique()
			.$defaultFn(() => `user_${createId()}`),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
	},
	(table) => ({
		emailIdx: index("email_idx").on(table.email),
	}),
);

export const sessions = sqliteTable(
	"sessions",
	{
		id,
		expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
		token: text("token").notNull().unique(),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		activeOrganizationId: text("active_organization_id"),
	},
	(table) => ({
		userIdIdx: index("user_id_idx").on(table.userId),
		tokenIdx: index("token_idx").on(table.token),
		expiresAtIdx: index("expires_at_idx").on(table.expiresAt),
	}),
);

export const accounts = sqliteTable(
	"accounts",
	{
		id,
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: integer("access_token_expires_at", {
			mode: "timestamp",
		}),
		refreshTokenExpiresAt: integer("refresh_token_expires_at", {
			mode: "timestamp",
		}),
		scope: text("scope"),
		password: text("password"),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
	},
	(table) => ({
		userIdIdx: index("accounts_user_id_idx").on(table.userId),
		providerCompoundIdx: index("provider_compound_idx").on(
			table.providerId,
			table.accountId,
		),
	}),
);

export const verifications = sqliteTable(
	"verifications",
	{
		id,
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
		createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
			() => new Date(),
		),
		updatedAt: integer("updated_at", { mode: "timestamp" }),
	},
	(table) => ({
		identifierIdx: index("identifier_idx").on(table.identifier),
		expiresAtIdx: index("verifications_expires_at_idx").on(table.expiresAt),
	}),
);

export const projects = sqliteTable(
	"projects",
	{
		id,
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		description: text("description"),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organizations.id, { onDelete: "cascade" }),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp" }),
	},
	(table) => ({
		orgIdx: index("org_idx").on(table.organizationId),
		slugOrgIdx: uniqueIndex("slug_org_idx").on(
			table.slug,
			table.organizationId,
		),
	}),
);

export const organizations = sqliteTable(
	"organizations",
	{
		id,
		name: text("name").notNull(),
		slug: text("slug").unique(),
		logo: text("logo"),
		plan: text("plan", { enum: ["free", "pro"] })
			.notNull()
			.default("free"),
		apiKey: text("api_key")
			.notNull()
			.unique()
			.$defaultFn(() => `org_${createId()}`),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
		metadata: text("metadata"),
	},
	(table) => ({
		slugIdx: index("slug_idx").on(table.slug),
		apiKeyIdx: index("org_api_key_idx").on(table.apiKey),
	}),
);

export const members = sqliteTable(
	"members",
	{
		id,
		organizationId: text("organization_id")
			.notNull()
			.references(() => organizations.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		role: text("role").notNull(),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(table) => ({
		orgUserIdx: index("org_user_idx").on(table.organizationId, table.userId),
	}),
);

export const invitations = sqliteTable(
	"invitations",
	{
		id,
		organizationId: text("organization_id")
			.notNull()
			.references(() => organizations.id, { onDelete: "cascade" }),
		email: text("email").notNull(),
		role: text("role"),
		status: text("status").notNull(),
		expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
		inviterId: text("inviter_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
	},
	(table) => ({
		orgEmailIdx: index("org_email_idx").on(table.organizationId, table.email),
		expiresAtIdx: index("invitations_expires_at_idx").on(table.expiresAt),
	}),
);