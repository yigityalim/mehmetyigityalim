"use client";

import React from "react";
import { format } from "date-fns";
import { Button } from "@myy/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useStore } from "@/store";
import { tr } from "date-fns/locale";

export function DatePicker() {
	const nextMonth = useStore((state) => state.nextMonth);
	const prevMonth = useStore((state) => state.prevMonth);
	const resetMonth = useStore((state) => state.resetMonth);
	const currentMonth = useStore((state) => state.currentMonth);

	const currentDate = new Date();

	return (
		<div className="w-full flex flex-row items-center justify-between md:justify-end gap-x-2 md:gap-x-10">
			<Button size="icon" onClick={prevMonth}>
				<ArrowLeft />
			</Button>
			<h2
				className="text-lg font-semibold text-gray-800 dark:text-gray-200"
				onClick={resetMonth}
			>
				{format(currentMonth, "MMM yyyy", { locale: tr })}
			</h2>
			<Button
				size="icon"
				disabled={currentDate.getMonth() === currentMonth.getMonth()}
				onClick={() => {
					if (currentDate.getMonth() === currentMonth.getMonth()) return;
					nextMonth();
				}}
			>
				<ArrowRight />
			</Button>
		</div>
	);
}
