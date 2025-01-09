"use client";

import { getUpTimeColor, statusText } from "@/lib/status-utils";
import type { ListComponentsReturnType } from "@/db/services";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@myy/ui/accordion";
import { cn } from "@myy/ui/cn";
import { useMediaQuery } from "@myy/ui/hooks";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { ServiceStatusSkeleton } from "./loading";
import { StatusBar } from "./status-bar";
import type { DailyStatus } from "./types";

type ServiceStatusProps = {
	components: NonNullable<Awaited<ListComponentsReturnType>>;
	className?: string;
	hideSiteName?: boolean;
};

type GroupedComponents = {
	[groupId: string]: NonNullable<Awaited<ListComponentsReturnType>>;
};

export function ServiceStatus({
	components,
	className,
	hideSiteName = false,
}: ServiceStatusProps) {
	if (!components) return null;
	const [openState, setOpenState] = useState<string[]>([]);
	const [status, setStatus] = useState<string>();
	const [loading, setLoading] = useState(true);
	const isMobile = useMediaQuery("(max-width: 640px)");

	useEffect(() => {
		(async () => {
			const response = await fetch("/api/status?filter=status");
			const data = (await response.json()) as string;
			setStatus(data);
			setLoading(false);
		})();
	}, []);

	const groupedComponents = useMemo(() => {
		return components.reduce((acc: GroupedComponents, component) => {
			if (!component.group) return acc;
			const groupId = component.group.id;
			if (!acc[groupId]) {
				acc[groupId] = [];
			}
			acc[groupId].push(component);
			return acc;
		}, {});
	}, [components]);

	if (!components.length) return null;

	return (
		<Suspense fallback={<ServiceStatusSkeleton className={className} />}>
			<Accordion
				type="multiple"
				className="w-full"
				value={openState}
				onValueChange={setOpenState}
			>
				{Object.entries(groupedComponents).map(
					([groupId, groupComponents], index) => {
						const isNotFirst = index !== 0;
						const isOpen = openState.includes(groupId);

						if (!groupComponents || !(groupComponents.length > 0)) return null;

						return (
							<AccordionItem
								key={groupId}
								value={groupId}
								className={cn(
									"w-full flex flex-col space-y-2 p-3 rounded-lg relative transition-all duration-300 border-none z-20",
									className,
									index !== Object.keys(groupedComponents).length - 1 //last
										? "pb-0"
										: "",
								)}
							>
								<AccordionTrigger
									className={cn("px-5 py-2 gap-x-2 rounded-lg", {
										"dark:bg-statuspage-neutral-800 mt-2 border-t border-statuspage-neutral-80 dark:border-statuspage-neutral-700 rounded-t-none":
											isOpen,
										"bg-statuspage-neutral-40 dark:bg-statuspage-neutral-700":
											!isOpen,
										"border-t border-statuspage-neutral-80 dark:border-statuspage-neutral-700 pt-4":
											isNotFirst && isOpen,
										"border-none": !(isNotFirst && isOpen),
									})}
								>
									<ServiceStatusHeader
										groupName={groupComponents[0].group!.name}
										status={status}
										className={cn(
											openState.includes(groupId)
												? "bg-neutral-60 dark:bg-statuspage-neutral-600" //open
												: "bg-transparent", //closed
										)}
									/>
								</AccordionTrigger>
								<AccordionContent>
									{groupComponents?.map((component) => (
										<ServiceStatusContent
											key={component.id}
											component={component}
											hideSiteName={hideSiteName}
											isMobile={isMobile}
										/>
									))}
								</AccordionContent>
							</AccordionItem>
						);
					},
				)}
			</Accordion>
		</Suspense>
	);
}

function ServiceStatusHeader({
	groupName,
	className,
	status,
}: {
	groupName: string;
	className: string;
	status: string;
}) {
	return (
		<motion.div
			whileTap={{ scale: 0.98 }}
			className="flex items-center justify-between w-full"
		>
			<span className="font-medium">{groupName}</span>
			<React.Suspense
				fallback={
					<>
						<div className="w-4 h-4 bg-neutral-50 rounded-full animate-pulse" />
						<div className="w-8 h-4 bg-neutral-50 rounded-full animate-pulse" />
						<div className="w-4 h-4 bg-neutral-50 rounded-full animate-pulse" />
					</>
				}
			>
				<span
					className={cn(
						"text-xs font-medium text-statuspage-neutral-800 dark:text-white inline-flex items-center gap-x-1 p-1.5 pr-2 rounded-full transition-colors",
						className,
					)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						id="root"
						className="text-[#10B981] inline"
						viewBox="0 0 19 18"
						fill="none"
						height="18"
						width="18"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M9.50005 16.2008C11.4096 16.2008 13.241 15.4422 14.5912 14.092C15.9415 12.7417 16.7 10.9103 16.7 9.00078C16.7 7.09122 15.9415 5.25987 14.5912 3.90961C13.241 2.55935 11.4096 1.80078 9.50005 1.80078C7.59049 1.80078 5.75914 2.55935 4.40888 3.90961C3.05862 5.25987 2.30005 7.09122 2.30005 9.00078C2.30005 10.9103 3.05862 12.7417 4.40888 14.092C5.75914 15.4422 7.59049 16.2008 9.50005 16.2008ZM12.8894 7.20888C12.9536 7.14766 13.005 7.07441 13.0408 6.99331C13.0766 6.91221 13.0961 6.82485 13.0981 6.73622C13.1002 6.64759 13.0848 6.55943 13.0527 6.47676C13.0207 6.3941 12.9727 6.31855 12.9115 6.25443C12.8503 6.19031 12.777 6.13888 12.6959 6.10307C12.6148 6.06727 12.5275 6.04778 12.4388 6.04573C12.3502 6.04369 12.262 6.05912 12.1794 6.09114C12.0967 6.12317 12.0212 6.17116 11.957 6.23238C10.6037 7.52551 9.41617 8.98176 8.42185 10.5677L7.05205 9.19878C6.99025 9.13246 6.91573 9.07927 6.83293 9.04238C6.75013 9.00549 6.66075 8.98565 6.57012 8.98405C6.47949 8.98245 6.38946 8.99912 6.30541 9.03307C6.22136 9.06702 6.14501 9.11755 6.08091 9.18165C6.01682 9.24574 5.96629 9.32209 5.93234 9.40614C5.89839 9.49019 5.88172 9.58022 5.88332 9.67085C5.88492 9.76148 5.90475 9.85087 5.94165 9.93367C5.97854 10.0165 6.03173 10.091 6.09805 10.1528L8.07805 12.1337C8.15136 12.207 8.24059 12.2625 8.33881 12.2958C8.43703 12.3291 8.5416 12.3393 8.64441 12.3256C8.74721 12.3119 8.84548 12.2748 8.93159 12.217C9.0177 12.1592 9.08934 12.0823 9.14095 11.9924C10.1547 10.2265 11.4171 8.61548 12.8894 7.20888Z"
							fill="currentColor"
						/>
					</svg>
					{statusText[status as keyof typeof statusText]}
				</span>
			</React.Suspense>
		</motion.div>
	);
}

function ServiceStatusContent({
	component,
	hideSiteName,
	isMobile,
}: {
	component: NonNullable<Awaited<ListComponentsReturnType>>[number];
	hideSiteName: boolean;
	isMobile: boolean;
}) {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	const daysToShow = 30; //FIXME: useMediaQuery("(max-width: 640px)") ? 30 : 90; use 30 days for mobile, 60 days for tablet, 90 days for desktop
	const today = new Date();
	const startDate = new Date(
		today.getTime() - (daysToShow - 1) * 24 * 60 * 60 * 1000,
	);

	const dailyStatus = useMemo(
		() => calculateDailyStatus(component, startDate, daysToShow),
		[component],
	);

	const upTimePercentage = useMemo(
		() => calculateUpTimePercentage(dailyStatus),
		[dailyStatus],
	);

	return (
		<div className="px-3 sm:px-4 py-4 border-b last:border-b-0 border-statuspage-neutral-80 dark:border-statuspage-neutral-700">
			<ServiceNameAndUptime
				component={component}
				hideSiteName={hideSiteName}
				upTimePercentage={upTimePercentage}
			/>
			<StatusBar
				dailyStatus={dailyStatus}
				hoveredIndex={hoveredIndex}
				setHoveredIndex={setHoveredIndex}
			/>
			<TimeRange dailyStatus={dailyStatus} isMobile={isMobile} />
		</div>
	);
}

function ServiceNameAndUptime({
	component,
	hideSiteName,
	upTimePercentage,
}: {
	component: NonNullable<Awaited<ListComponentsReturnType>>[number];
	hideSiteName: boolean;
	upTimePercentage: string;
}) {
	return (
		<div className="flex items-center justify-start w-full pb-4">
			{!hideSiteName && (
				<>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						id="root"
						className="text-[#10B981] mr-1 shrink-0"
						viewBox="0 0 19 18"
						fill="none"
						height="18"
						width="18"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M9.50005 16.2008C11.4096 16.2008 13.241 15.4422 14.5912 14.092C15.9415 12.7417 16.7 10.9103 16.7 9.00078C16.7 7.09122 15.9415 5.25987 14.5912 3.90961C13.241 2.55935 11.4096 1.80078 9.50005 1.80078C7.59049 1.80078 5.75914 2.55935 4.40888 3.90961C3.05862 5.25987 2.30005 7.09122 2.30005 9.00078C2.30005 10.9103 3.05862 12.7417 4.40888 14.092C5.75914 15.4422 7.59049 16.2008 9.50005 16.2008ZM12.8894 7.20888C12.9536 7.14766 13.005 7.07441 13.0408 6.99331C13.0766 6.91221 13.0961 6.82485 13.0981 6.73622C13.1002 6.64759 13.0848 6.55943 13.0527 6.47676C13.0207 6.3941 12.9727 6.31855 12.9115 6.25443C12.8503 6.19031 12.777 6.13888 12.6959 6.10307C12.6148 6.06727 12.5275 6.04778 12.4388 6.04573C12.3502 6.04369 12.262 6.05912 12.1794 6.09114C12.0967 6.12317 12.0212 6.17116 11.957 6.23238C10.6037 7.52551 9.41617 8.98176 8.42185 10.5677L7.05205 9.19878C6.99025 9.13246 6.91573 9.07927 6.83293 9.04238C6.75013 9.00549 6.66075 8.98565 6.57012 8.98405C6.47949 8.98245 6.38946 8.99912 6.30541 9.03307C6.22136 9.06702 6.14501 9.11755 6.08091 9.18165C6.01682 9.24574 5.96629 9.32209 5.93234 9.40614C5.89839 9.49019 5.88172 9.58022 5.88332 9.67085C5.88492 9.76148 5.90475 9.85087 5.94165 9.93367C5.97854 10.0165 6.03173 10.091 6.09805 10.1528L8.07805 12.1337C8.15136 12.207 8.24059 12.2625 8.33881 12.2958C8.43703 12.3291 8.5416 12.3393 8.64441 12.3256C8.74721 12.3119 8.84548 12.2748 8.93159 12.217C9.0177 12.1592 9.08934 12.0823 9.14095 11.9924C10.1547 10.2265 11.4171 8.61548 12.8894 7.20888Z"
							fill="currentColor"
						/>
					</svg>
					<Link
						href={`/component/${component.id}`}
						className="text-xs font-semibold overflow-x-auto shrink truncate"
					>
						{component.name}
					</Link>
				</>
			)}
			<div className="ml-2 sm:ml-auto flex items-center justify-end gap-x-2 whitespace-nowrap">
				<span
					className={cn(
						"font-semibold text-xs",
						getUpTimeColor(+upTimePercentage),
					)}
				>
					{upTimePercentage}% çalışma süresi
				</span>
			</div>
		</div>
	);
}

function TimeRange({
	dailyStatus,
	isMobile,
}: {
	dailyStatus: DailyStatus[];
	isMobile: boolean;
}) {
	return (
		<div className="flex justify-between items-center gap-x-1 text-xs text-gray-500 mt-2">
			<span className="font-semibold text-gray-900 dark:text-gray-400">
				{isMobile ? "Son 30 gün" : "Son 90 gün"}
			</span>
			<span className="font-semibold text-gray-900 dark:text-gray-400">
				Bugün
				{/*format(
          dailyStatus[dailyStatus.length - 1]?.date ?? new Date(),
          "d MMMM",
          { locale: tr },
        )*/}
			</span>
		</div>
	);
}

function calculateDailyStatus(
	component: NonNullable<Awaited<ListComponentsReturnType>>[number],
	startDate: Date,
	daysToShow: number,
): DailyStatus[] {
	return Array.from({ length: daysToShow }, (_, index) => {
		const currentDate = new Date(
			startDate.getTime() + index * 24 * 60 * 60 * 1000,
		);
		const dayStart = new Date(currentDate.setHours(0, 0, 0, 0));
		const dayEnd = new Date(currentDate.setHours(23, 59, 59, 999));

		const events = component.incidents.filter(
			(incident) =>
				new Date(incident.created_at) >= dayStart &&
				new Date(incident.created_at) <= dayEnd,
		);

		return { date: currentDate, events };
	});
}

function calculateUpTimePercentage(dailyStatus: DailyStatus[]): string {
	return (
		(dailyStatus.filter((day) => day.events.length === 0).length /
			dailyStatus.length) *
		100
	).toFixed(2);
}
