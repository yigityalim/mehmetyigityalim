"use client";

import type { IncidentServiceFunctionReturnType } from "@/server/services";
import { useSessionStorage } from "@myy/shared/hooks";
import { cn } from "@myy/ui/cn";
import { useState } from "react";
import { Incident } from "./incident";

export function LastIncident({
	incident,
}: {
	incident: NonNullable<IncidentServiceFunctionReturnType<"listIncidents">>;
}) {
	const [open, setOpen] = useSessionStorage("last-incident-open", true);

	return (
		<div className="w-full">
			<div className="w-full inline-flex gap-x-2 items-center justify-between">
				<h2
					className={cn(
						"text-2xl font-bold text-start mb-4 transition-colors",
						open ? "text-zinc-200" : "text-muted-foreground",
					)}
				>
					Son Olay
				</h2>
				<button
					type="button"
					onClick={() => setOpen(!open)}
					className="text-muted-foreground text-sm hover:underline hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
				>
					{open ? "Kapat" : "Aç"}
				</button>
			</div>
			{open && <Incident incident={incident} />}
		</div>
	);
}
