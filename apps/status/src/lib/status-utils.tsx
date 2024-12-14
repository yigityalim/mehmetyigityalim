import { Check, CircleAlert } from "lucide-react";

export const statusColors = {
	operational: "#2ecc71",
	degraded_performance: "#f1c40f",
	partial_outage: "#e67e22",
	major_outage: "#e74c3c",
};

export const statusText = {
	operational: "Çalışıyor",
	degraded_performance: "Kısmi Performans",
	partial_outage: "Kısmi Kesinti",
	major_outage: "Büyük Kesinti",
};

export const maintenanceText = {
	scheduled: "Planlandı.",
	in_progress: "Devam ediyor.",
	completed: "Tamamlandı.",
};

export const statusIcons = {
	investigating: <CircleAlert size={24} />,
	identified: <CircleAlert size={24} />,
	monitoring: <CircleAlert size={24} />,
	resolved: <Check size={24} />,
} as const;

export function getUpTimeColor(upTimePercentage: number): string {
	if (upTimePercentage >= 99) return "text-green-500";
	if (upTimePercentage >= 95) return "text-blue-500";
	if (upTimePercentage >= 80) return "text-yellow-500";
	if (upTimePercentage > 0) return "text-red-500";
	return "text-gray-500";
}

export function getBarHeight(
	hoveredIndex: number | null,
	index: number,
): string {
	if (hoveredIndex === null) return "h-7";
	const distance = Math.abs(hoveredIndex - index);
	if (distance === 0) return "h-11";
	if (distance === 1) return "h-10";
	if (distance === 2) return "h-9";
	if (distance === 3) return "h-8";
	return "h-7";
}
