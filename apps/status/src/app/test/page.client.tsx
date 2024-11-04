"use client";

import { useState } from "react";
import { incidentService } from "@/server/services/incident";
import {
	format,
	subMonths,
	addMonths,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
} from "date-fns";
import { cn } from "@myy/ui/cn";
import { tr } from "date-fns/locale";
import { Button } from "@myy/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { IncidentEventSelect, IncidentSelect } from "@/server/schema";

export function Test({
	data,
}: {
	data: {
		incidents: IncidentSelect[];
		incident_events: IncidentEventSelect[];
	};
}) {
	console.log(data);

	const [currentMonth, setCurrentMonth] = useState(new Date());

	const goToPreviousMonth = () =>
		setCurrentMonth((prevMonth) => subMonths(prevMonth, 1));
	const goToNextMonth = () =>
		setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));

	const daysInMonth = eachDayOfInterval({
		start: startOfMonth(currentMonth),
		end: endOfMonth(currentMonth),
	});

	return (
		<div className="min-h-dvh p-6 flex flex-col items-center justify-start">
			<div className="w-full max-w-4xl mb-6 flex items-center justify-between">
				<Button onClick={goToPreviousMonth} variant="outline" size="icon">
					<ChevronLeft className="h-4 w-4" />
					<span className="sr-only">Önceki ay</span>
				</Button>
				<h2 className="text-2xl font-bold">
					{format(currentMonth, "MMMM yyyy", { locale: tr })}
				</h2>
				<Button onClick={goToNextMonth} variant="outline" size="icon">
					<ChevronRight className="h-4 w-4" />
					<span className="sr-only">Sonraki ay</span>
				</Button>
			</div>
			<div className="w-full max-w-4xl space-y-6">
				{daysInMonth.map((date) => {
					const formattedDate = format(date, "yyyy-MM-dd");
					const incidentsForDay =
						data?.incidents.filter(
							(incident) =>
								format(new Date(incident.created_at as Date), "yyyy-MM-dd") ===
								formattedDate,
						) || [];

					return (
						<div key={formattedDate} className="w-full">
							<div className="w-full flex items-center justify-start py-2 border-b border-b-foreground mb-6">
								<h3 className="text-lg font-semibold">
									{format(date, "d MMMM yyyy", { locale: tr })}
								</h3>
							</div>
							<div>
								{incidentsForDay.length > 0 ? (
									incidentsForDay.map((incident) => {
										return (
											<div key={incident.id} className="mb-4 last:mb-0">
												<h4
													className={cn(
														"text-xl font-semibold capitalize mb-2",
														{
															"text-yellow-500": incident.status === "open",
															"text-green-500": incident.status === "resolved",
															"text-destructive": incident.status === "closed",
															"text-blue-500":
																incident.status === "investigating",
															"text-purple-500": incident.status === "created",
														},
													)}
												>
													{incident.title}
												</h4>
												<div className="space-y-2">
													{[].map((event) => (
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
																	{ locale: tr },
																)}
															</p>
														</div>
													))}
												</div>
											</div>
										);
									})
								) : (
									<p className="text-muted-foreground">Bu gün bir olay yok.</p>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
