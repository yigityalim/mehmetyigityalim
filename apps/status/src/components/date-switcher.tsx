import { addMonths, format, subMonths } from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export async function DateSwitcher({ currentDate }: { currentDate: Date }) {
	return (
		<div className="flex items-center justify-between gap-4">
			<Link
				href={`/incidents?date=${format(subMonths(currentDate, 3), "yyyy-MM-dd")}`}
				className="p-1 rounded bg-statuspage-neutral-60 dark:bg-statuspage-neutral-700 flex items-center justify-center transition active:scale-90"
			>
				<ChevronLeft size={24} />
			</Link>
			<span className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
				{format(subMonths(currentDate, 3), "MMMM", { locale: tr })} -
				{format(currentDate, "MMMM", { locale: tr })}
			</span>
			<Link
				href={`/incidents?date=${format(addMonths(currentDate, 3), "yyyy-MM-dd")}`}
				className="p-1 rounded bg-statuspage-neutral-60 dark:bg-statuspage-neutral-700 flex items-center justify-center transition active:scale-90"
			>
				<ChevronRight size={24} />
			</Link>
		</div>
	);
}
