"use client";

import React from "react";
import { cn } from "@myy/ui/cn";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@myy/ui/button";
import type { IncidentSelect } from "@/server/schema";

const translate = {
	created: "Oluşturuldu",
	updated: "Güncellendi",
	resolved: "Çözüldü",
	closed: "Kapatıldı",
	investigating: "Araştırılıyor",
};

export function Incident({
	incident,
	className,
	isOpen,
}: Readonly<{
	incident: IncidentSelect;
	className?: string;
	isOpen?: boolean;
}>) {
	const [open, setOpen] = React.useState(isOpen ?? false);
	return (
		<div className="w-full">
			<div className="w-full flex flex-col items-start justify-between gap-y-4">
				<Link
					href={`/incidents/${incident.id}`}
					className={cn(
						"text-lg font-bold mb-4",
						{
							"text-accent": incident.status === "resolved",
							"text-destructive": incident.status === "closed",
							"text-yellow-500": incident.status === "open",
						},
						className,
					)}
				>
					{incident.title}
				</Link>
			</div>
			{incident.events.length > 3 ? (
				<>
					<div
						className="w-full flex flex-col items-start justify-start gap-2"
						key="events"
					>
						<div className="w-full flex flex-col gap-4">
							{(isOpen ? incident.events : incident.events.slice(0, 3)).map(
								(event) => (
									<Container
										key={event.id}
										status={event.status}
										message={event.message}
										date={event.created_at}
									/>
								),
							)}
						</div>
						<AnimatePresence mode="wait">
							{open && (
								<motion.div className="w-full flex flex-col items-start justify-start gap-2">
									{incident.events.slice(3).map((event) => (
										<Container
											key={event.id}
											status={event.status}
											message={event.message}
											date={event.created_at}
										/>
									))}
								</motion.div>
							)}
						</AnimatePresence>
					</div>
					{!isOpen && (
						<Button
							variant="secondary"
							size="sm"
							onClick={() => setOpen((prev) => !prev)}
							className="mt-4 w-full text-zinc-700 dark:text-zinc-200 py-1"
						>
							{open
								? "Daha az göster"
								: `+${incident.events.length - 3} daha fazla`}
						</Button>
					)}
				</>
			) : (
				<div className="w-full flex flex-col items-start justify-start gap-2">
					{incident.events.map((event) => (
						<Container
							key={event.id}
							status={event.status}
							message={event.message}
							date={event.created_at}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function Container({
	status,
	message,
	date,
}: Readonly<{
	status: "created" | "updated" | "resolved" | "closed" | "investigating";
	message: string;
	date: DateTime;
}>) {
	return (
		<div
			key={status}
			className="w-full flex flex-col items-start justify-start gap-2 border-b border-gray-200 py-2 dark:border-gray-900"
		>
			<p className="w-full text-xs whitespace-pre-line">
				<span
					className={cn(
						"font-bold bg-muted px-1 pr-1.5 py-0.5 mr-2 mb-2 text-[0.85rem] whitespace-nowrap",
						{
							"text-blue-500 bg-blue-100 dark:bg-blue-900 dark:text-blue-200":
								status === "created",
							"text-purple-500 bg-purple-100 dark:bg-purple-900 dark:text-purple-200":
								status === "updated",
							"text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-200":
								status === "resolved",
							"text-yellow-500 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200":
								status === "investigating",
							"text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-200":
								status === "closed",
						},
					)}
				>
					{translate[status.toLowerCase() as keyof typeof translate]}
				</span>
				<span className="text-gray-600 dark:text-gray-50">{message}</span>
			</p>
			<p className="text-xs text-gray-400 dark:text-gray-200">
				{format(new Date(date), "dd MMM, HH:mm", {
					locale: tr,
				})}
			</p>
		</div>
	);
}
