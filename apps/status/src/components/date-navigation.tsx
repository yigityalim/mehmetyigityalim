"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { format, addDays, subDays } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@myy/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DateNavigation({ currentDate }: { currentDate: Date }) {
	const router = useRouter();

	const handleDateChange = (newDate: Date) => {
		router.push(`?date=${format(newDate, "yyyy-MM-dd")}`, { scroll: false });
	};

	return (
		<div className="w-full flex items-center justify-between py-2 mb-6">
			<h3 className="text-lg font-semibold">
				{format(currentDate, "MMMM yyyy", { locale: tr })}
			</h3>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="icon"
					onClick={() => handleDateChange(subDays(currentDate, 20))}
				>
					<ChevronLeft className="h-4 w-4" />
					<span className="sr-only">Önceki 20 gün</span>
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => handleDateChange(new Date())}
				>
					Bugün
				</Button>
				<Button
					variant="outline"
					size="icon"
					onClick={() => handleDateChange(addDays(currentDate, 20))}
				>
					<ChevronRight className="h-4 w-4" />
					<span className="sr-only">Sonraki 20 gün</span>
				</Button>
			</div>
		</div>
	);
}
