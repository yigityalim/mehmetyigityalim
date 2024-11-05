"use client";

import { useState } from "react";
import {
	format,
	subMonths,
	addMonths,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	isSameDay,
} from "date-fns";
import { cn } from "@myy/ui/cn";
import { tr } from "date-fns/locale";
import { Button } from "@myy/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { DataType } from "./page";

export function IncidentList({
	incidents,
	params,
}: {
	incidents: DataType;
	params: { month: string; year: string };
}) {
	return (
		<div className="min-h-dvh p-6 flex flex-col items-center justify-start">
			<div className="w-full max-w-4xl space-y-6">
				{groupedIncidents.map(({ date, incidents }) => (
					<div key={format(date, "yyyy-MM-dd")} className="w-full">
						<div className="w-full flex items-center justify-start py-2 border-b border-b-foreground mb-6">
							<h3 className="text-lg font-semibold">
								{format(date, "d MMMM yyyy", { locale: tr })}
							</h3>
						</div>
						{incidents.length > 0 ? (
							incidents.map(({ incident, incident_events }) => (
								<div key={incident.id} className="mb-4 last:mb-0">
									<h4
										className={cn("text-xl font-semibold capitalize mb-2", {
											"text-yellow-500": incident.status === "open",
											"text-green-500": incident.status === "resolved",
											"text-destructive": incident.status === "closed",
											"text-blue-500": incident.status === "investigating",
											"text-purple-500": incident.status === "created",
										})}
									>
										{incident.title}
									</h4>
									<div className="space-y-2">
										{incident_events.map((event) => (
											<div
												key={event.hash}
												id={event.hash ?? ""}
												className="flex flex-col gap-1"
											>
												<div className="flex items-center gap-2">
													<span
														className={cn("font-medium", {
															"text-purple-500": event.status === "created",
															"text-yellow-500": event.status === "open",
															"text-green-500": event.status === "resolved",
															"text-destructive": event.status === "closed",
															"text-blue-500": event.status === "investigating",
														})}
													>
														{event.status}
													</span>
													<span className="text-sm text-muted-foreground">
														{event.message}
													</span>
												</div>
												<p className="text-xs text-muted-foreground">
													{format(new Date(event.created_at as Date), "HH:mm", {
														locale: tr,
													})}
												</p>
											</div>
										))}
									</div>
								</div>
							))
						) : (
							<p className="text-muted-foreground">Bu gün bir olay yok.</p>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
