import type { IncidentSelect } from "@/server/schema";
import { cn } from "@myy/ui/cn";

const colors = (
	{ status }: { status: IncidentSelect["status"] },
	bg?: boolean,
) =>
	cn(
		bg
			? {
					"bg-blue-500": status === "detected",
					"bg-blue-600": status === "investigating",
					"bg-blue-700": status === "identified",
					"bg-blue-800": status === "resolving",
					"bg-blue-900": status === "monitoring",
					"bg-green-500": status === "resolved",
					"bg-gray-500": status === "closed",
				}
			: {
					"text-red-500": status === "detected",
					"text-blue-600": status === "investigating",
					"text-green-400": status === "identified",
					"text-yellow-700 dark:text-yellow-300": status === "resolving",
					"text-gray-900 dark:text-gray-100": status === "monitoring",
					"text-green-700 dark:text-green-400": status === "resolved",
					"text-gray-900 dark:text-gray-200": status === "closed",
				},
	);

const severityColors = (
	{
		severity,
	}: {
		severity: IncidentSelect["severity"];
	},
	bg?: boolean,
) =>
	cn(
		bg
			? {
					"bg-yellow-500": severity === "minor",
					"bg-orange-500": severity === "major",
					"bg-red-500": severity === "critical",
				}
			: {
					"text-yellow-500": severity === "minor",
					"text-orange-500": severity === "major",
					"text-red-500": severity === "critical",
				},
	);

const statusText = {
	detected: "Tespit edildi",
	investigating: "Araştırılıyor",
	identified: "Tanımlandı",
	resolving: "Çözülüyor",
	monitoring: "İzleniyor",
	resolved: "Çözüldü",
	closed: "Kapandı",
} as const;

const methodNotAllowed = new Response("Method Not Allowed", {
	status: 405,
	statusText: "Method Not Allowed",
});

const impactText = {
	unknown: "Bilinmiyor",
	degraded_performance: "Kötü performans",
	partial_outage: "Kısmi kesinti",
	major_outage: "Tam kesinti",
	maintenance: "Bakım",
	operational: "Operasyonel",
} as const;

export { colors, severityColors, statusText, impactText, methodNotAllowed };
