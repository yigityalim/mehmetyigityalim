import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";
import type { DailyStatus } from "./types";

type HoverCardProps = {
	hoveredIndex: number | null;
	dailyStatus: DailyStatus[];
};

export function HoverCard({ hoveredIndex, dailyStatus }: HoverCardProps) {
	const [position, setPosition] = useState({ left: 0, right: "auto" });
	const cardRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (
			hoveredIndex === null ||
			!dailyStatus[hoveredIndex] ||
			!cardRef.current ||
			!containerRef.current
		)
			return;

		const cardWidth = cardRef.current.offsetWidth;
		const containerWidth = containerRef.current.offsetWidth;
		const dayWidth = containerWidth / dailyStatus.length;
		let left = hoveredIndex * dayWidth + dayWidth / 2 - cardWidth / 2;

		if (left < 0) {
			left = 0;
		}

		if (left + cardWidth > containerWidth) {
			left = containerWidth - cardWidth;
		}

		setPosition({ left, right: "auto" });

		return () => {
			setPosition({ left: 0, right: "auto" });
		};
	}, [hoveredIndex, dailyStatus]);

	if (hoveredIndex === null || !dailyStatus[hoveredIndex]) return null;

	return (
		<div ref={containerRef} className="relative w-full">
			<AnimatePresence>
				<motion.div
					ref={cardRef}
					key="hover-card"
					id={`hover-card-${hoveredIndex}`}
					className="absolute z-30"
					style={{
						left: position.left,
						right: position.right,
					}}
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.2 }}
				>
					<div className="bg-white dark:bg-statuspage-neutral-700 rounded-lg shadow-lg border border-gray-200 dark:border-statuspage-neutral-600 p-4 w-64">
						test
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
