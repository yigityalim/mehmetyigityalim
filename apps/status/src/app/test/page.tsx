import { listIncidents } from "@/server/services";
import { Button } from "@myy/ui/button";
import { cn } from "@myy/ui/cn";
import {
	addMonths,
	eachDayOfInterval,
	endOfMonth,
	format,
	startOfMonth,
	subDays,
	subMonths,
} from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function MonthlyIncidentList({
	searchParams,
}: {
	searchParams: Promise<{
		month?: string;
		year?: string;
		open_event?: string;
	}>;
}) {
	let { month, year, open_event } = await searchParams;

	year ??= format(new Date(), "yyyy");

	const targetDate =
		month && year ? new Date(Number(year), Number(month) - 1) : new Date();

	const thirtyDaysAgo = subDays(targetDate, 29);
	/*
	const data = await listIncidents({
		from: targetDate ? startOfMonth(targetDate) : thirtyDaysAgo,
		to: targetDate ? endOfMonth(targetDate) : new Date(),
	});*/

	const prevMonth = subMonths(targetDate, 1);
	const nextMonth = addMonths(targetDate, 1);

	const daysInMonth = eachDayOfInterval({
		start: targetDate ? endOfMonth(targetDate) : thirtyDaysAgo,
		end: targetDate ?? startOfMonth(targetDate),
	}).reverse();

	if (true) {
		return <div>test...</div>;
	}

	return (
		<div className="min-h-dvh p-6 flex flex-col items-center justify-start">
			<div className="w-full max-w-4xl space-y-6">
				<div className="w-full">
					<div className="w-full flex items-center justify-between py-2 mb-6">
						<h3 className="text-lg font-semibold">
							{format(targetDate, "MMMM yyyy", { locale: tr })}
						</h3>
						<div className="flex items-center gap-2">
							<Link
								href={`?month=${format(prevMonth, "M")}&year=${format(prevMonth, "yyyy")}`}
								passHref
							>
								<Button variant="outline" size="icon">
									<ChevronLeft className="h-4 w-4" />
									<span className="sr-only">Önceki ay</span>
								</Button>
							</Link>
							<Link
								//href={`?month=${format(new Date(), "M")}&year=${format(new Date(), "yyyy")}`}
								href="/test"
								passHref
							>
								<Button variant="outline" size="sm">
									Bugün
								</Button>
							</Link>
							<Link
								href={`?month=${format(nextMonth, "M")}&year=${format(nextMonth, "yyyy")}`}
								passHref
							>
								<Button variant="outline" size="icon">
									<ChevronRight className="h-4 w-4" />
									<span className="sr-only">Sonraki ay</span>
								</Button>
							</Link>
						</div>
					</div>
					{daysInMonth.map((day) => {
						const dayIncidents = data.filter(
							(incident) =>
								new Date(incident.created_at as Date).toDateString() ===
								day.toDateString(),
						);

						return (
							<div key={day.toISOString()} className="mb-8 last:mb-0">
								<h4 className="text-lg font-semibold mb-2 border-b border-b-muted-foreground pb-2">
									{format(day, "d MMMM yyyy", { locale: tr })}
								</h4>
								{dayIncidents.length > 0 ? (
									dayIncidents.map((incident) => (
										<div key={incident.id} className="mb-4 last:mb-0">
											<h5
												className={cn("text-xl font-semibold capitalize mb-2", {
													"text-yellow-500": incident.status === "open",
													"text-green-500": incident.status === "resolved",
													"text-destructive": incident.status === "closed",
													"text-blue-500": incident.status === "investigating",
													"text-purple-500": incident.status === "created",
												})}
											>
												{incident.title}
											</h5>
											<div className="space-y-2">
												{incident.events
													.slice(open_event ? 0 : incident.events.length - 3)
													.map((event) => (
														<div
															key={event.hash}
															id={event.hash ?? ""}
															className="flex flex-col gap-1"
														>
															<div className="flex items-center gap-2">
																<span
																	className={cn("font-medium", {
																		"text-purple-500":
																			event.status === "created",
																		"text-yellow-500": event.status === "open",
																		"text-green-500":
																			event.status === "resolved",
																		"text-destructive":
																			event.status === "closed",
																		"text-blue-500":
																			event.status === "investigating",
																	})}
																>
																	{event.status}
																</span>
																<span className="text-sm text-muted-foreground">
																	{event.message}
																</span>
															</div>
															<p className="text-xs text-muted-foreground">
																{format(
																	new Date(event.created_at as Date),
																	"HH:mm",
																	{
																		locale: tr,
																	},
																)}
															</p>
														</div>
													))}
												{incident.events.length > 3 && (
													<Link
														href={`/test?open_event=${incident.id}`}
														passHref
													>
														<Button variant="outline" size="sm">
															Daha fazla
														</Button>
													</Link>
												)}
											</div>
										</div>
									))
								) : (
									<p className="text-muted-foreground">
										Bu gün için olay kaydı bulunmamaktadır.
									</p>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
