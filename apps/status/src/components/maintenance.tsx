"use client";

import { maintenanceText } from "@/lib/status-utils";
import type { ScheduledMaintenanceServiceFunctionReturnType } from "@/server/services";
import { cn } from "@myy/ui/cn";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Wrench } from "lucide-react";
import Link from "next/link";
import React from "react";

export type Props = Readonly<{
	maintenance: NonNullable<
		ScheduledMaintenanceServiceFunctionReturnType<"listScheduledMaintenance">
	>[number];
	className?: string;
}>;

export function Maintenance({ maintenance, className }: Props) {
	return (
		<Link
			className={cn(
				"block pt-8 transition hover:bg-neutral-20 dark:bg-statuspage-neutral-800 dark:hover:bg-statuspage-neutral-700/70 px-7 pb-8 border-b last:border-none border-statuspage-neutral-80 dark:border-statuspage-neutral-700 rounded-lg",
				className,
			)}
			href={`/maintenance/${maintenance.id}`}
		>
			<div className="flex">
				<p className="grow text-statuspage-neutral-800 dark:text-white font-medium text-base">
					{maintenance.name}
				</p>
				{maintenance.status ? (
					<div className="ml-4 whitespace-nowrap">
						<div className="inline-block text-xs px-2 py-1 rounded-full leading-none text-[#0369A1] bg-[#0369A1]/20">
							Bakım
						</div>
					</div>
				) : null}
			</div>
			<div className="mt-6 flex">
				<div className="shrink-0 relative mt-4 mr-2">
					<Wrench className="text-[#939DB8] dark:text-[#424757] size-6" />

					<div className="absolute top-7 left-2 -bottom-2 border-l dark:border-statuspage-neutral-700 border-statuspage-neutral-80/50" />
				</div>
				<div className="mb-1 grow relative minW-0">
					<div className="px-4 pt-4 relative z-20 border rounded-lg shadow-small bg-statuspage-neutral-40 dark:bg-statuspage-neutral-700 border-statuspage-neutral-80 dark:border-statuspage-neutral-600">
						<p>
							<span className="font-medium text-statuspage-neutral-800 dark:text-white">
								Bakım
							</span>
							<span className="ml-1 text-xs text-statuspage-neutral-200">
								{format(
									new Date(maintenance.scheduled_start_time),
									"d MMM yyyy, HH:mm a",
									{
										locale: tr,
									},
								)}
							</span>
						</p>
						<div className="my-3 w-full text-xs text-statuspage-neutral-200">
							<p>{maintenance.description}</p>
						</div>
					</div>
				</div>
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
					{maintenanceText[maintenance.status]}
				</p>
			</div>
		</Link>
	);
}
