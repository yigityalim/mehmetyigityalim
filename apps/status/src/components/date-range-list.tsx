"use client";

import { Incident } from "@/components/incident";
import { IncidentSelect } from "@/server/schema";
import type { IncidentServiceFunctionReturnType } from "@/server/services";
import { randomString } from "@myy/shared";
import {
	parseAsString,
	parseAsStringEnum,
	useQueryStates,
} from "@myy/shared/params";
import { Button } from "@myy/ui/button";
import { Input } from "@myy/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@myy/ui/select";
import {
	addDays,
	addMonths,
	eachDayOfInterval,
	eachMonthOfInterval,
	format,
	isSameMonth,
	subDays,
	subMonths,
} from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

type DateRangeListProps = {
	showDateFilters?: boolean;
	incidents: IncidentServiceFunctionReturnType<"listIncidents">;
	initialTargetDate: Date;
};

type ViewPeriod = "day" | "month" | "quarter";

export function DateRangeList({
	showDateFilters = false,
	incidents,
	initialTargetDate,
}: Readonly<DateRangeListProps>) {
	const [expandedMonths, setExpandedMonths] = React.useState<string[]>([]);
	const [showFilters, setShowFilters] = React.useState(false);

	const [
		{ targetDate, viewPeriod, title, status, impact, severity },
		setQueryStates,
	] = useQueryStates(
		{
			targetDate: parseAsString.withDefault(initialTargetDate.toISOString()),
			viewPeriod: parseAsStringEnum<ViewPeriod>([
				"day",
				"month",
				"quarter",
			]).withDefault(showDateFilters ? "month" : "day"),
			title: parseAsString.withDefault(""),
			status: parseAsString.withDefault("all"),
			impact: parseAsString.withDefault("all"),
			severity: parseAsString.withDefault("all"),
		},
		{ history: "push" },
	);

	const targetDateObj = new Date(targetDate);
	const twentyDaysAgo = subDays(targetDateObj, 19);

	const daysOrMonthsToShow = React.useMemo(() => {
		switch (viewPeriod) {
			case "day":
				return eachDayOfInterval({
					start: twentyDaysAgo,
					end: targetDateObj,
				}).reverse();
			case "month":
				return eachMonthOfInterval({
					start: subMonths(targetDateObj, 11),
					end: targetDateObj,
				}).reverse();
			case "quarter":
				return eachMonthOfInterval({
					start: subMonths(targetDateObj, 2),
					end: targetDateObj,
				}).reverse();
		}
	}, [viewPeriod, twentyDaysAgo]);

	const handlePrevious = async () => {
		await setQueryStates((prev) => ({
			targetDate: (() => {
				const prevDate = new Date(prev.targetDate);
				switch (prev.viewPeriod) {
					case "day":
						return subDays(prevDate, 1).toISOString();
					case "month":
						return subMonths(prevDate, 1).toISOString();
					case "quarter":
						return subMonths(prevDate, 3).toISOString();
				}
			})(),
		}));
	};

	const handleNext = async () => {
		await setQueryStates((prev) => ({
			targetDate: (() => {
				const prevDate = new Date(prev.targetDate);
				switch (prev.viewPeriod) {
					case "day":
						return addDays(prevDate, 1).toISOString();
					case "month":
						return addMonths(prevDate, 1).toISOString();
					case "quarter":
						return addMonths(prevDate, 3).toISOString();
				}
			})(),
		}));
	};

	const toggleExpand = (monthKey: string) => {
		setExpandedMonths((prev) =>
			prev.includes(monthKey)
				? prev.filter((m) => m !== monthKey)
				: [...prev, monthKey],
		);
	};

	const filteredIncidents = React.useMemo(() => {
		if (!incidents) return [];
		return incidents.filter((incident) => {
			return (
				incident.title.toLowerCase().includes(title.toLowerCase()) &&
				(status === "all" || incident.status === status) &&
				(impact === "all" || incident.impact === impact) &&
				(severity === "all" || incident.severity === severity)
			);
		});
	}, [incidents, title, status, impact, severity]);

	return (
		<div className="w-full">
			{showDateFilters && (
				<Button
					onClick={() => setShowFilters(!showFilters)}
					variant="primary"
					className="mb-4 w-full"
				>
					{showFilters ? "Filtreleri Gizle" : "Filtreleri Göster"}
				</Button>
			)}
			{showDateFilters && showFilters && (
				<div className="flex flex-col gap-4 mb-4">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-2">
							<Button onClick={handlePrevious} variant="outline" size="icon">
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<Button onClick={handleNext} variant="outline" size="icon">
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
						<Select
							value={viewPeriod}
							onValueChange={async (value) =>
								await setQueryStates({ viewPeriod: value as ViewPeriod })
							}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Görünüm seçin" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="day">Günlük Görünüm</SelectItem>
								<SelectItem value="month">Aylık Görünüm</SelectItem>
								<SelectItem value="quarter">3 Aylık Görünüm</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-wrap gap-2">
						<Input
							placeholder="Başlık ara"
							value={title}
							onChange={async (e) =>
								await setQueryStates({ title: e.target.value || null })
							}
							className="w-full sm:w-auto"
						/>
						<Select
							value={status}
							onValueChange={async (value) =>
								await setQueryStates({ status: value })
							}
						>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Durum" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Tümü</SelectItem>
								<SelectItem value="detected">Tespit Edildi</SelectItem>
								<SelectItem value="investigating">Araştırılıyor</SelectItem>
								<SelectItem value="identified">Tanımlandı</SelectItem>
								<SelectItem value="monitoring">İzleniyor</SelectItem>
								<SelectItem value="resolved">Çözüldü</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={impact}
							onValueChange={async (value) =>
								await setQueryStates({ impact: value })
							}
						>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Etki" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Tümü</SelectItem>
								<SelectItem value="none">Yok</SelectItem>
								<SelectItem value="minor">Küçük</SelectItem>
								<SelectItem value="major">Büyük</SelectItem>
								<SelectItem value="critical">Kritik</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={severity}
							onValueChange={async (value) =>
								await setQueryStates({ severity: value })
							}
						>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Şiddet" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Tümü</SelectItem>
								<SelectItem value="minor">Küçük</SelectItem>
								<SelectItem value="major">Büyük</SelectItem>
								<SelectItem value="critical">Kritik</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<Button
						onClick={async () =>
							void (await setQueryStates({
								targetDate: initialTargetDate.toISOString(),
								viewPeriod: showDateFilters ? "month" : "day",
								title: "",
								status: "all",
								impact: "all",
								severity: "all",
							}))
						}
						variant="destructive"
					>
						Filtreleri Temizle
					</Button>
				</div>
			)}
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
				{daysOrMonthsToShow.map((dateItem) => {
					const periodIncidents = filteredIncidents.filter((incident) => {
						const incidentDate = new Date(incident.created_at as Date);
						switch (viewPeriod) {
							case "day":
								return incidentDate.toDateString() === dateItem.toDateString();
							case "month":
							case "quarter":
								return isSameMonth(incidentDate, dateItem);
						}
					});

					const periodKey = format(dateItem, "yyyy-MM");
					const isExpanded = expandedMonths.includes(periodKey);
					const displayedIncidents =
						(viewPeriod === "month" || viewPeriod === "quarter") && !isExpanded
							? periodIncidents.slice(0, 3)
							: periodIncidents;

					return (
						<div key={dateItem.toISOString()} className="mb-8">
							<h4 className="text-sm font-semibold mb-4 border-b px-5 border-b-muted-foreground pb-2 text-[#8A91A5]">
								{format(
									dateItem,
									viewPeriod === "day" ? "d MMMM yyyy" : "MMMM yyyy",
									{ locale: tr },
								)}
							</h4>
							{displayedIncidents.length > 0 ? (
								<div className="w-full px-5">
									{displayedIncidents.map((incident) =>
										incident ? (
											<Incident key={incident.id} incident={incident} />
										) : null,
									)}
									{(viewPeriod === "month" || viewPeriod === "quarter") &&
										periodIncidents.length > 3 && (
											<Button
												onClick={() => toggleExpand(periodKey)}
												variant="outline"
												className="mt-2 w-full"
											>
												{isExpanded
													? "Daha az göster"
													: `${periodIncidents.length - 3} daha fazla göster`}
											</Button>
										)}
								</div>
							) : (
								<p className="text-muted-foreground pl-5">
									{viewPeriod === "day" ? "Bu gün" : "Bu dönem"} için olay kaydı
									bulunmamaktadır.
								</p>
							)}
						</div>
					);
				})}
			</React.Suspense>
		</div>
	);
}
