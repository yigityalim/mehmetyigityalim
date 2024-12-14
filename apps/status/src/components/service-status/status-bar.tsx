import type { DailyStatus } from "@/components/service-status/types";
import { getBarHeight } from "@/lib/status-utils";
import { statusColors } from "@/lib/status-utils";

import { HoverCard } from "@/components/service-status/hover-card";
import { cn } from "@myy/ui/cn";
import type React from "react";

type StatusBarProps = {
	dailyStatus: DailyStatus[];
	hoveredIndex: number | null;
	setHoveredIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export function StatusBar({
	dailyStatus,
	hoveredIndex,
	setHoveredIndex,
}: StatusBarProps) {
	return (
		<div className="relative w-full">
			<div className="relative h-11 overflow-hidden w-full">
				<div className="flex h-full items-center justify-between w-full">
					{dailyStatus.map((day, index) => (
						<div
							key={day.date.toISOString()}
							className={cn(
								"w-full h-8 pr-[1.5px] cursor-pointer",
								index === dailyStatus.length - 1
									? "flex-grow-0 flex-shrink-0"
									: "flex-grow flex-shrink",
							)}
							style={{
								flexBasis: `${100 / dailyStatus.length}%`,
							}}
							onMouseEnter={() => setHoveredIndex(index)}
							onMouseLeave={() => setHoveredIndex(null)}
						>
							<span
								style={{
									backgroundColor:
										statusColors[
											day.events.length > 0
												? (day.events[0]!.impact as keyof typeof statusColors)
												: "operational"
										],
								}}
								className={cn(
									"w-full h-full block",
									index === 0 && "rounded-l",
									index === dailyStatus.length - 1 && "rounded-r",
								)}
							/>
						</div>
					))}
				</div>
			</div>
			<HoverCard hoveredIndex={hoveredIndex} dailyStatus={dailyStatus} />
		</div>
	);
}
