import React from "react";
import { cn } from "@myy/ui/cn";
import { randomString } from "@myy/shared";

export function ServiceStatusSkeleton({
	daysToShow = 30,
	className,
}: {
	daysToShow?: number;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"w-full flex flex-col space-y-2 p-4 rounded-md animate-pulse",
				className,
			)}
		>
			<div className="flex items-center justify-between">
				<div className="h-5 w-32 bg-gray-200 rounded-md dark:bg-zinc-800" />
				<div className="flex items-center space-x-2">
					<div className="h-5 w-20 bg-gray-200 rounded-md dark:bg-zinc-800" />
				</div>
			</div>
			<div className="relative h-8 overflow-hidden rounded">
				<div className="flex h-full w-full justify-between">
					{Array.from({ length: daysToShow }).map((_, index) => (
						<div
							key={randomString()}
							className="w-[8px] mx-[1px] h-full bg-gray-200 rounded-md dark:bg-zinc-800"
						/>
					))}
				</div>
			</div>
			<div className="flex justify-between text-sm">
				<div className="h-4 w-20 bg-gray-200 rounded-md dark:bg-zinc-800" />
				<div className="h-4 w-24 bg-gray-200 rounded-md dark:bg-zinc-800" />
				<div className="h-4 w-20 bg-gray-200 rounded-md dark:bg-zinc-800" />
			</div>
		</div>
	);
}
