import React from "react";
import { incidentService } from "@/server/services/incident";
import {
	startOfDay,
	endOfDay,
	format,
	subDays,
	eachDayOfInterval,
} from "date-fns";
import { tr } from "date-fns/locale";
import { Status } from "@/components/status";
import { Incident } from "@/components/incident";
import { DateNavigation } from "@/components/date-navigation";
import { randomString } from "@myy/shared";

export type DataType = Awaited<
	ReturnType<typeof incidentService.listIncidents>
>;

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{
		date?: string;
	}>;
}) {
	const { date } = await searchParams;
	const targetDate = date ? new Date(date) : new Date();

	const twentyDaysAgo = subDays(targetDate, 19);

	const data = await incidentService.listIncidents({
		from: startOfDay(twentyDaysAgo),
		to: endOfDay(targetDate),
	});

	const daysToShow = eachDayOfInterval({
		start: twentyDaysAgo,
		end: targetDate,
	}).reverse();

	if (!data) {
		return <div>sonuç bulunamadı.</div>;
	}

	return (
		<>
			<Status />
			<section className="grid grid-cols-1 gap-4 pt-12">
				<h1 className="w-full text-start text-3xl font-medium text-zinc-800 dark:text-zinc-200">
					Son paylaşımlar
				</h1>
				<div className="w-full max-w-4xl space-y-6">
					<div className="w-full">
						<DateNavigation currentDate={targetDate} />
						<React.Suspense
							fallback={
								<div className="w-full flex flex-col gap-10 mb-8">
									{Array.from({ length: 10 }).map((_) => (
										<div
											key={randomString(10)}
											className="animate-pulse flex flex-col gap-4"
										>
											<div className="w-1/2 h-4 bg-gray-400 rounded-md" />
											<div className="w-full h-px bg-gray-200 rounded-md" />
											<div className="w-2/3 h-4 bg-gray-200 rounded-md" />
										</div>
									))}
								</div>
							}
						>
							{daysToShow.map(async (day) => {
								const dayIncidents = data.filter(
									(incident) =>
										new Date(incident.created_at as Date).toDateString() ===
										day.toDateString(),
								);

								return (
									<div key={day.toISOString()} className="mb-8">
										<h4 className="text-lg font-semibold mb-2 border-b border-b-muted-foreground pb-2">
											{format(day, "d MMMM yyyy", { locale: tr })}
										</h4>
										{dayIncidents.length > 0 ? (
											dayIncidents.map((incident) => (
												<Incident key={incident.id} incident={incident} />
											))
										) : (
											<p className="text-muted-foreground">
												Bu gün için olay kaydı bulunmamaktadır.
											</p>
										)}
									</div>
								);
							})}
						</React.Suspense>
					</div>
				</div>
			</section>
		</>
	);
}

export const metadata = {
	title: "Status ",
};
