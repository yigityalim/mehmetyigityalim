// utils.ts
import { db } from "@/db/db";
import { component, incident } from "@/db/schema";
import { asc, desc, eq, lte, or } from "drizzle-orm";
import services from "./index";
import path from "node:path";
import * as fs from "node:fs";

export type UtilsServiceFunctionReturnType<
	K extends keyof typeof utilsService,
> = Awaited<ReturnType<(typeof utilsService)[K]>>;

export const utilsService = {
	getComponentStatus,
	getActiveIncidents,
	getSystemStatus,
	getUptime,
	withErrorHandling,
	isDatabaseEmpty,
};

/**
 * Bileşen durumlarını döndürür.
 * @example
 * const componentStatus = await getComponentStatus();
 * console.log(componentStatus);
 */
export async function getComponentStatus() {
	return withErrorHandling(
		async () => {
			return db.query.component.findMany({
				orderBy: [asc(component.order)],
			});
		},
		{ logError: false },
	);
}

/**
 * Aktif olayları döndürür.
 * @example
 * const activeIncidents = await getActiveIncidents();
 * console.log(activeIncidents);
 */
export async function getActiveIncidents() {
	return db.query.incident.findMany({
		where: or(
			eq(incident.status, "investigating"),
			eq(incident.status, "identified"),
			eq(incident.status, "monitoring"),
		),
		with: {
			updates: true,
			impactedComponents: {
				with: {
					component: true,
				},
			},
		},
		orderBy: [desc(incident.created_at)],
	});
}

/**
 * Sistem durumunu döndürür.
 * @param {Object} filters
 * @param {boolean} filters.status Sadece durumu döndürür
 * @example
 * const status = await getSystemStatus({ filters: { status: true } });
 * console.log(status);
 * // "operational"
 * @example
 * const status = await getSystemStatus({ filters: { status: false } });
 * console.log(status);
 * // { overallStatus: "operational", components: [], activeIncidents: [] }
 */
export async function getSystemStatus({
	filters,
}: {
	filters?: {
		status?: boolean;
		date?: boolean;
	};
}) {
	const [components, activeIncidents] = await Promise.all([
		getComponentStatus(),
		getActiveIncidents(),
	]);

	if (!components || !activeIncidents) {
		return "operational";
	}

	let overallStatus = "operational";
	for (const component of components) {
		if (component.status === "major_outage") {
			overallStatus = "major_outage";
			break;
		}
		if (
			component.status === "partial_outage" &&
			overallStatus !== "major_outage"
		) {
			overallStatus = "partial_outage";
		} else if (
			component.status === "degraded_performance" &&
			overallStatus === "operational"
		) {
			overallStatus = "degraded_performance";
		}
	}

	if (filters?.status) {
		return overallStatus;
	}

	if (filters?.date) {
		// burada en son güncelleme tarihi döndürülebilir
		const [lastIncidentDate] = await db
			.select({ created_at: incident.created_at })
			.from(incident)
			.orderBy(desc(incident.created_at));

		if (lastIncidentDate) {
			return {
				lastIncidentDate,
			};
		}

		return {
			lastIncidentDate: { created_at: new Date() },
		};
	}

	return {
		overallStatus,
		components,
		activeIncidents,
	};
}

/**
 * Belirtilen bileşenin belirtilen gün sayısı boyunca çalışma süresini döndürür.
 * @param {string} componentId Bileşen kimliği
 * @param {number} days Gün sayısı
 * @returns {Promise<number>} Çalışma süresi yüzdesi
 * @example
 * const uptime = await getUptime("component-[hash]", 30);
 *
 * if (uptime > 0.99) {
 * 	console.log("System is up and running");
 * } else {
 * 	console.log("System is down");
 * }
 */
export async function getUptime(
	componentId: string,
	days: number,
): Promise<number> {
	const now = new Date();
	const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

	const incidents = await services.incident.getIncidentHistory(
		componentId,
		startDate,
		now,
	);

	if (!incidents) {
		return 1;
	}

	let downtime = 0;
	for (const incident of incidents) {
		const start = new Date(incident.started_at);
		const end = incident.resolved_at ? new Date(incident.resolved_at) : now;
		downtime += end.getTime() - start.getTime();
	}

	const totalTime = now.getTime() - startDate.getTime();
	return (totalTime - downtime) / totalTime;
}

/**
 * Hata yakalama işlevi ile bir işlevi sarmalar
 * @template T
 * @param {() => T | Promise<T>} fn İşlev veya işlevin dönüşü. Promise dönen işlevler için de kullanılabilir.
 * @param {{ logError?: boolean }} options Hata durumunda konsola hata yazdırma seçeneği
 * @returns {T | Promise<T> | undefined} İşlevin dönüş değeri veya undefined
 * @example
 * const result = withErrorHandling(() => someFunction());
 * if (result) {
 *  // do something with result
 * }
 *
 * @example
 * const [obj1, obj2] = await Promise.all(withErrorHandling(async () => [
 *  await someAsyncFunction(),
 *  await anotherAsyncFunction(),
 * ]));
 *
 * @example
 *
 * const result = await withErrorHandling(async () => await someAsyncFunction());
 * if (result) {
 * // do something with result
 * }
 */
export function withErrorHandling<T>(
	fn: () => T | Promise<T>,
	{ logError = true }: { logError?: boolean } = {},
): T | Promise<T | undefined> | undefined {
	try {
		const result = fn();

		if (result instanceof Promise) {
			return result.catch((error) => {
				if (logError) {
					console.error("Async error:", error);
				}
				return undefined;
			});
		}

		return result;
	} catch (error) {
		if (logError) {
			console.error("Sync error:", error);
		}
		return undefined;
	}
}

/**
 * Veritabanının boş olup olmadığını kontrol eder.
 * @returns {boolean | Promise<boolean | undefined> | undefined} Veritabanı boş ise true, dolu ise false döner
 * @example
 * const isEmpty = isDatabaseEmpty();
 * console.log(isEmpty);
 */
export function isDatabaseEmpty(): boolean | Promise<boolean | undefined> | undefined {
	return withErrorHandling(async () => {

		if (fs.existsSync(path.join(process.cwd(), "data", process.env.DATABASE_NAME!))) {
			return false;
		}

		const incidentCount = await db.$count(incident);

		if (incidentCount > 0) {
			return false;
		}

		//TODO: add more checks here

		return true
	});
}
