"use client";

import { colors, severityColors, statusText } from "@/lib/utils";
import type {
	IncidentImpactSelect,
	IncidentSelect,
	IncidentUpdateSelect,
} from "@/server/schema";
import type { IncidentServiceFunctionReturnType } from "@/server/services";
import { Button } from "@myy/ui/button";
import { cn } from "@myy/ui/cn";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export type Props = Readonly<{
	incident: NonNullable<
		IncidentServiceFunctionReturnType<"listIncidents">
	>[number] & {
		impactedComponents: NonNullable<IncidentImpactSelect[]>;
		updates: NonNullable<IncidentUpdateSelect[]>;
	};
	className?: string;
}>;

export function Incident({ incident, className }: Props) {
	const lastUpdate = incident.updates[incident.updates.length - 1];

	return (
		<Link
			className={cn(
				"block pt-8 transition hover:bg-neutral-20 dark:bg-statuspage-neutral-800 dark:hover:bg-statuspage-neutral-700/70 px-7 pb-8 border-b last:border-none border-statuspage-neutral-80 dark:border-statuspage-neutral-700 rounded-lg md:pl-0",
				className,
			)}
			href={`/incidents/${incident.id}`}
		>
			<div className="flex">
				<p className="grow text-statuspage-neutral-800 dark:text-white font-medium text-base">
					{incident.title}
				</p>
				{statusText[incident.status] ? (
					<div className="ml-4 whitespace-nowrap">
						<div
							className={cn(
								"inline-block text-xs px-2 py-1 rounded-full leading-none text-[#D97706] bg-[#D97706]/20",
								incident.status === "detected"
									? "bg-[#D97706]/20 text-[#D97706]"
									: "",
								incident.status === "investigating"
									? "bg-[#4B5563]/20 text-[#4B5563]"
									: "",
								incident.status === "identified"
									? "bg-[#A855F7]/20 text-[#A855F7]"
									: "",
								incident.status === "resolving"
									? "bg-[#E11D48]/20 text-[#E11D48]"
									: "",
								incident.status === "monitoring"
									? "bg-[#2563EB]/20 text-[#2563EB]"
									: "",
								incident.status === "resolved"
									? "bg-[#059669]/20 text-[#059669]"
									: "",
								incident.status === "closed"
									? "bg-[#6B7280]/20 text-[#6B7280]"
									: "",
							)}
						>
							{statusText[incident.status]}
						</div>
					</div>
				) : null}
			</div>
			<div className="mt-6 flex">
				<div className="shrink-0 relative mt-4 mr-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 18 18"
						className="text-[#059669]"
						height="18"
						width="18"
					>
						<path
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="1.3"
							d="M10.922 7.313a9.01 9.01 0 0 0-2.57 3.852L6.75 9.563m9-.563a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"
						/>
					</svg>

					<div className="absolute top-7 left-2 -bottom-2 border-l dark:border-statuspage-neutral-700 border-statuspage-neutral-80/50" />
				</div>
				{lastUpdate ? (
					<div className="mb-1 grow relative minW-0">
						<div className="px-4 pt-4 relative z-20 border rounded-lg shadow-small bg-statuspage-neutral-40 dark:bg-statuspage-neutral-700 border-statuspage-neutral-80 dark:border-statuspage-neutral-600">
							<p>
								<span className="font-medium text-statuspage-neutral-800 dark:text-white">
									{lastUpdate.title}
								</span>
								<span className="ml-1 text-xs text-statuspage-neutral-200">
									{format(
										new Date(lastUpdate.created_at),
										"d MMM yyyy, HH:mm a",
										{
											locale: tr,
										},
									)}
								</span>
							</p>
							<div className="my-3 w-full text-xs text-statuspage-neutral-200">
								<p>{lastUpdate.content}</p>
							</div>
						</div>
						{Array.from({
							length: Math.min(incident.updates.length, 2),
						}).map((_, index) => (
							<div
								key={index}
								className={cn(
									"absolute left-0 right-0 h-10 border rounded-lg shadow-small bg-statuspage-neutral-40 dark:bg-statuspage-neutral-700 border-statuspage-neutral-80 dark:border-statuspage-neutral-600",
									index === 0
										? "z-10 -bottom-1 mx-[1px]"
										: "-bottom-2 mx-[2px]",
								)}
							/>
						))}
					</div>
				) : null}
			</div>
			<div className="mt-4 flex items-center">
				<div className="shrink-0 mr-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						id="root"
						viewBox="0 0 16 16"
						fill="none"
						className="text-[#939DB8] dark:text-[#424757]"
						height="18"
						width="18"
					>
						<g clipPath="url(#clip0_684_12672)">
							<path
								d="M5 2.80664V2.81164"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M2.80835 5V5.005"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M2 8V8.005"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M2.80835 11V11.005"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M5 13.1934V13.1984"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M8 14V14.005"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M11 13.1934V13.1984"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M13.1917 11V11.005"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M14 8V8.005"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M13.1917 5V5.005"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M11 2.80664V2.81164"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M8 2V2.005"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</g>
						<defs>
							<clipPath id="clip0_684_12672">
								<rect width="16" height="16" fill="white" />
							</clipPath>
						</defs>
					</svg>
				</div>
				<p className="text-statuspage-neutral-200 text-sm">
					{incident.updates.length} geçmiş güncelleme
				</p>
			</div>
		</Link>
	);
}
