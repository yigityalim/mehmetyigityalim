import { IncidentActionsDropdown } from "@/components/incident-actions-dropdown";
import { cn } from "@myy/ui/cn";
import { format } from "date-fns";
import { Check, ChevronRight, Flame } from "lucide-react";
import Link from "next/link";
import type React from "react";

export default async function IncidentIdPage({
	params,
}: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const isClosed = false;
	return (
		<div className="w-full flex flex-col items-center justify-center gap-2">
			<div className="w-full flex flex-row gap-x-2 items-center justify-between mb-12">
				<div className="inline-flex flex-row gap-x-1 items-center justify-start">
					<Link href="/dashboard/incidents">Olaylar</Link>
					<ChevronRight size={16} />
					<span>TEST</span>
				</div>
				<IncidentActionsDropdown />
			</div>
			<div className="w-full flex flex-row gap-x-2 items-center justify-start mb-10">
				<div
					className={cn(
						"text-white rounded-full relative mr-4 p-2",
						isClosed ? "bg-green-500" : "bg-red-500",
					)}
				>
					{isClosed ? (
						<Check size={24} />
					) : (
						<>
							<div className="text-white absolute inset-0 rounded-full animate-ping opacity-20 bg-red-500" />
							<Flame size={24} />
						</>
					)}
				</div>
				<div className="w-full flex flex-col gap-y-1 items-start justify-center">
					<h1 className="text-2xl font-semibold">Olay</h1>
					<p className="text-gray-500 italic">#test</p>
				</div>
			</div>
			<div className="w-full flex flex-col gap-2 items-center justify-center">
				<div className="w-full flex flex-row gap-x-2 items-center justify-between">
					<h3 className="text-lg font-semibold">Komponent:</h3>
					<p className="text-gray-500">#test</p>
				</div>
				<div className="w-full flex flex-row gap-x-2 items-center justify-between">
					<h3 className="text-lg font-semibold">Yayınladı mı?</h3>
					<p className="text-gray-500">
						{format(new Date(), "dd/MM/yyyy HH:mm")}
					</p>
				</div>
				<div className="w-full flex flex-row gap-x-2 items-center justify-between">
					<h3 className="text-lg font-semibold">Etki:</h3>
					<p className="text-gray-500 inline-flex items-center gap-x-2">
						<span className="size-3 rounded-full bg-orange-500 block" />
						<span>Sistemde kısmi kesintiler var</span>
					</p>
				</div>
				<div className="mt-10 bg-zinc-100 dark:bg-zinc-950 p-4 w-full rounded">
					<div className="w-full flex flex-row gap-x-2 items-center justify-between mb-4">
						<h3 className="text-lg font-semibold">Açıklama:</h3>
						<p className="text-gray-500 italic font-mono">#test</p>
					</div>
					<div className="w-full flex flex-row gap-x-2 items-center justify-between">
						<h3 className="text-lg font-semibold">Çözüm:</h3>
						<p className="text-gray-500 italic font-mono">#test</p>
					</div>
				</div>
			</div>
		</div>
	);
}
