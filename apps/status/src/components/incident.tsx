"use client";

import { Button } from "@myy/ui/button";
import { cn } from "@myy/ui/cn";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";
import type { incidentService } from "@/server/services/incident";
import React from "react";
import { ArrowRight } from "lucide-react";
import type { IncidentSelect } from "@/server/schema";

export type Props = Readonly<{
	incident: Awaited<ReturnType<typeof incidentService.listIncidents>>[number];
}>;

const colors = ({
	status,
}: {
	status: IncidentSelect["status"];
}) =>
	cn({
		"text-yellow-500": status === "open",
		"text-green-500": status === "resolved",
		"text-destructive": status === "closed",
		"text-blue-500": status === "investigating",
		"text-purple-500": status === "created",
		"text-primary": status === "update",
	});

export function Incident({ incident }: Props) {
	const [expanded, setExpanded] = React.useState(false);

	return (
		<div key={incident.id} className="w-full flex flex-col gap-4 mb-4 py-4">
			<Link
				href={`/incident/${encodeURIComponent(incident.id.toString())}`}
				className={cn("text-xl font-semibold capitalize", colors(incident))}
			>
				{incident.title}
			</Link>
			<h6 className="text-sm text-blue-500 inline-flex gap-x-2 items-center justify-start">
				<Link href={`/site/${encodeURIComponent(incident.site.url)}`}>
					{incident.site.name}
				</Link>
				<ArrowRight size={16} className={cn("w-4 shrink-0 -rotate-45")} />
			</h6>
			<div
				className={cn(
					"w-full flex flex-col items-start justify-center gap-4 mb-4",
					{ "mb-3": expanded },
				)}
			>
				{incident.events.slice(0, 3).map((event) => (
					<IncidentEvent event={event} key={event.hash} />
				))}
				{expanded &&
					incident.events
						.slice(3)
						.map((event) => <IncidentEvent event={event} key={event.hash} />)}
			</div>
			{incident.events.length > 3 && (
				<Button
					onClick={() => setExpanded((prev) => !prev)}
					className="text-xs w-full"
					size="sm"
				>
					{expanded ? "Gizle" : "Daha fazla"}
				</Button>
			)}
		</div>
	);
}

export function IncidentEvent({
	event,
}: { event: Props["incident"]["events"][number] }) {
	const eventText = {
		open: "Açık",
		resolved: "Çözüldü",
		closed: "Kapandı",
		investigating: "Araştırılıyor",
		created: "Oluşturuldu",
		update: "Güncelleme",
		updated: "Güncellendi",
	}[event.status];

	return (
		<div
			key={event.hash}
			className="flex flex-row items-center justify-start gap-4"
		>
			<ArrowRight size={16} className={cn("w-4 shrink-0", colors(event))} />
			<div className="flex flex-col items-start gap-1">
				<div className="space-x-2 w-full text-start">
					<span className={cn("font-medium", colors(event))}>
						{eventText} -
					</span>
					<span
						className="text-sm text-muted-foreground"
						style={{ maxWidth: "calc(100% - 1rem)" }}
					>
						{event.message}
					</span>
				</div>
				<p className="text-xs mt-0.5 text-muted-foreground">
					{format(new Date(event.created_at as Date), "HH:mm", {
						locale: tr,
					})}
				</p>
			</div>
		</div>
	);
}
