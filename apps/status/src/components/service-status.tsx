import React from "react";
import Link from "next/link";
import { Check, X, CircleAlert, Info } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@myy/ui/popover";
import { cn } from "@myy/ui/cn";
import { ServiceStatusSkeleton } from "./service-status.loading";
import type { SiteWithIncidentStatus } from "./status";
import type { IncidentSelect } from "@/server/schema";
import { sleep } from "@myy/shared";

const statusColors: Record<IncidentSelect["status"], string> = {
	open: "#f1c40f",
	created: "#3498db",
	updated: "#2ecc71",
	update: "#e67e22",
	resolved: "#2fcc66",
	closed: "#95a5a6",
	investigating: "#e74c3c",
};

const statusText: Record<IncidentSelect["status"], string> = {
	open: "Açık",
	created: "Oluşturuldu",
	updated: "Güncellendi",
	update: "Güncelleme",
	resolved: "Çözüldü",
	closed: "Kapatıldı",
	investigating: "İnceleniyor",
};

const statusIcons = {
	open: <CircleAlert className="w-4 h-4 text-yellow-600" />,
	created: <Info className="w-4 h-4 text-blue-600" />,
	updated: <Check className="w-4 h-4 text-green-600" />,
	update: <CircleAlert className="w-4 h-4 text-orange-600" />,
	resolved: <Check className="w-4 h-4 text-green-600" />,
	closed: <X className="w-4 h-4 text-gray-600" />,
	investigating: <CircleAlert className="w-4 h-4 text-red-600" />,
} satisfies Record<IncidentSelect["status"], React.ReactNode>;

export async function ServiceStatus({
	site,
	daysToShow = 30,
	className,
	hideSiteName = false,
}: {
	site: SiteWithIncidentStatus;
	daysToShow: number;
	className?: string;
	hideSiteName?: boolean;
}) {
	const today = new Date();
	const startDate = new Date(
		today.getTime() - (daysToShow - 1) * 24 * 60 * 60 * 1000,
	);

	const sortedIncidents = [...site.incidents].sort(
		(a, b) =>
			new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
	);

	const currentStatus = sortedIncidents?.[0]?.status ?? "resolved";

	const dailyStatus = Array.from({ length: daysToShow }, (_, index) => {
		const currentDate = new Date(
			startDate.getTime() + index * 24 * 60 * 60 * 1000,
		);

		const dayStart = new Date(currentDate);
		dayStart.setHours(0, 0, 0, 0);
		const dayEnd = new Date(currentDate);
		dayEnd.setHours(23, 59, 59, 999);

		const eventsOnDay = site.incidents.flatMap((incident) =>
			incident.events.filter((event) => {
				const eventDate = new Date(event.created_at);
				return eventDate >= dayStart && eventDate <= dayEnd;
			}),
		);

		const lastEventStatus = eventsOnDay.length
			? (eventsOnDay[eventsOnDay.length - 1]?.status ?? "resolved")
			: "resolved";

		return {
			date: currentDate,
			status: lastEventStatus,
			events: eventsOnDay,
		};
	});

	const upTimePercentage = (
		(dailyStatus.filter((d) => d.status === "resolved").length / daysToShow) *
		100
	).toFixed(2);

	return (
		<React.Suspense fallback={<ServiceStatusSkeleton className={className} />}>
			<div
				className={cn(
					"w-full flex flex-col space-y-2 p-4 rounded-lg",
					className,
				)}
			>
				<div className="flex items-center justify-between">
					{!hideSiteName ? (
						<Link href={`/site/${site.id}`} className="text-sm font-semibold">
							{site.name}
						</Link>
					) : (
						<div />
					)}
					<div className="flex items-center space-x-2">
						<span
							className="text-sm font-medium"
							style={{ color: statusColors[currentStatus] }}
						>
							Durum: {statusText[currentStatus]}
						</span>
						{statusIcons[currentStatus as keyof typeof statusIcons]}
					</div>
				</div>
				<div className="relative h-8 overflow-hidden">
					<svg
						className="w-full h-full"
						preserveAspectRatio="none"
						viewBox={`0 0 ${daysToShow * 5} 34`}
					>
						{dailyStatus.map(async (day, index) => (
							<Popover key={day.date.toISOString()}>
								<PopoverTrigger asChild>
									<rect
										height="34"
										width="3"
										x={index * 5}
										y="0"
										fill={statusColors[day.status]}
										className="cursor-pointer"
									/>
								</PopoverTrigger>
								<PopoverContent className="w-80">
									<div className="space-y-2">
										<h3 className="font-semibold">
											{format(day.date, "d MMMM yyyy", { locale: tr })}
										</h3>

										{day.events.length > 0 ? (
											<>
												<p className="text-sm text-muted-foreground">
													Durum: {statusText[day.status]}
												</p>
												<ul className="space-y-1">
													{day.events.map((event) => (
														<li key={event.id} className="text-sm">
															{format(
																new Date(event.created_at),
																"d MMMM yyyy",
																{
																	locale: tr,
																},
															)}
															: {event.message}
														</li>
													))}
												</ul>
											</>
										) : (
											<p className="text-sm text-muted-foreground">
												Bu gün için olay kaydı bulunmamaktadır.
											</p>
										)}
									</div>
								</PopoverContent>
							</Popover>
						))}
					</svg>
				</div>
				<div className="flex justify-between text-sm text-gray-500">
					<span>
						{format(dailyStatus[0]?.date ?? today, "d MMMM", {
							locale: tr,
						})}
					</span>
					<span>{upTimePercentage}% çalışma süresi</span>
					<span>
						{format(
							dailyStatus[dailyStatus.length - 1]?.date ?? today,
							"d MMMM",
							{ locale: tr },
						)}
					</span>
				</div>
			</div>
		</React.Suspense>
	);
}
