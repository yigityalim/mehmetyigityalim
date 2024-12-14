"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export function HoverCard({
	trigger,
	content,
}: {
	trigger: React.ReactNode;
	content: React.ReactNode;
}) {
	const [isHovered, setIsHovered] = React.useState(false);

	return (
		<div
			className="relative size-7 inline-flex items-center justify-center hover:bg-[#EEEFF2] dark:hover:bg-[#2D313C] rounded cursor-pointer"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onTouchStart={() => setIsHovered(true)}
			onTouchEnd={() => setIsHovered(false)}
			onContextMenu={(e) => {
				e.preventDefault();
				setIsHovered(true);
			}}
		>
			{trigger}
			<AnimatePresence>
				{isHovered && (
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 20 }}
						transition={{ duration: 0.2 }}
						className="absolute z-10 -top-24 right-6 p-4 mr-2 bg-white border border-gray-200 rounded-lg shadow-lg dark:border-[#2D313C] dark:bg-[#21242D] cursor-default"
					>
						{content}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
