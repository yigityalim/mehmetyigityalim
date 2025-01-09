import { DateSwitcher } from "@/components/date-switcher";
import { Maintenance } from "@/components/maintenance";
import services, {
	type ScheduledMaintenanceServiceFunctionReturnType,
} from "@/db/services";
import {
	addMonths,
	endOfMonth,
	format,
	startOfMonth,
	subMonths,
} from "date-fns";
import { tr } from "date-fns/locale";
import React from "react";

export default async function MaintenancesPage({
	searchParams,
}: {
	searchParams: Promise<{ date?: string }>;
}) {
	const { date } = await searchParams;
	const currentDate = date ? new Date(date) : new Date();
	const maintenances = await services.scheduledMaintenance.isMaintenance();

	const monthsToShow = [
		currentDate,
		subMonths(currentDate, 1),
		subMonths(currentDate, 2),
	] as const;

	const maintenancesByMonth = monthsToShow.map((date) => {
		const monthStart = startOfMonth(date);
		const monthEnd = endOfMonth(date);
		return {
			date,
			maintenances: maintenances?.filter((maintenance) => {
				const maintenanceDate = new Date(maintenance.created_at as Date);
				return maintenanceDate >= monthStart && maintenanceDate <= monthEnd;
			}),
		};
	});

	return (
		<div className="flex flex-col items-center justify-start gap-4 w-full h-full">
			<div className="px-4 w-full flex flex-col md:flex-row gap-4 items-center justify-center md:justify-between">
				<h1 className="w-full text-center md:text-start text-3xl font-medium text-zinc-800 pb-6 dark:text-zinc-200">
					Bakım
				</h1>
				<DateSwitcher currentDate={currentDate} />
			</div>
			<div className="w-full h-full px-4">
				{maintenancesByMonth.map(({ date, maintenances }) => (
					<MonthMaintenance
						key={date.toISOString()}
						date={date}
						maintenances={maintenances}
					/>
				))}
			</div>
		</div>
	);
}

function MonthMaintenance({
	date,
	maintenances,
}: {
	date: Date;
	maintenances: Awaited<
		ScheduledMaintenanceServiceFunctionReturnType<"listScheduledMaintenance">
	>;
}) {
	return (
		<div className="mt-11 dark:bg-[#191C24] border border-[#E2E4E9] dark:border-[#21242D] rounded-lg shadow-small overflow-hidden">
			<div className="px-7 py-5 font-medium text-[#191C24] dark:text-white border-b border-[#E2E4E9]/50 dark:border-[#21242D]">
				{format(date, "MMMM yyyy", { locale: tr })}
			</div>
			{maintenances!.length === 0 ? (
				<div className="my-14 text-large text-center font-medium">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						id="root"
						viewBox="0 0 18 19"
						fill="none"
						className="inline -mt-[2px] mr-1"
						height="18"
						width="18"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M9.00005 16.7008C10.9096 16.7008 12.741 15.9422 14.0912 14.592C15.4415 13.2417 16.2 11.4103 16.2 9.50078C16.2 7.59122 15.4415 5.75987 14.0912 4.40961C12.741 3.05935 10.9096 2.30078 9.00005 2.30078C7.09049 2.30078 5.25914 3.05935 3.90888 4.40961C2.55862 5.75987 1.80005 7.59122 1.80005 9.50078C1.80005 11.4103 2.55862 13.2417 3.90888 14.592C5.25914 15.9422 7.09049 16.7008 9.00005 16.7008ZM12.3894 7.70888C12.4536 7.64766 12.505 7.57441 12.5408 7.49331C12.5766 7.41221 12.5961 7.32485 12.5981 7.23622C12.6002 7.14759 12.5848 7.05943 12.5527 6.97676C12.5207 6.8941 12.4727 6.81855 12.4115 6.75443C12.3503 6.69031 12.277 6.63888 12.1959 6.60307C12.1148 6.56727 12.0275 6.54778 11.9388 6.54573C11.8502 6.54369 11.762 6.55912 11.6794 6.59114C11.5967 6.62317 11.5212 6.67116 11.457 6.73238C10.1037 8.02551 8.91617 9.48176 7.92185 11.0677L6.55205 9.69878C6.49025 9.63246 6.41573 9.57927 6.33293 9.54238C6.25013 9.50549 6.16075 9.48565 6.07012 9.48405C5.97949 9.48245 5.88946 9.49912 5.80541 9.53307C5.72136 9.56702 5.64501 9.61755 5.58091 9.68165C5.51682 9.74574 5.46629 9.82209 5.43234 9.90614C5.39839 9.99019 5.38172 10.0802 5.38332 10.1709C5.38492 10.2615 5.40475 10.3509 5.44165 10.4337C5.47854 10.5165 5.53173 10.591 5.59805 10.6528L7.57805 12.6337C7.65136 12.707 7.74059 12.7625 7.83881 12.7958C7.93703 12.8291 8.0416 12.8393 8.14441 12.8256C8.24721 12.8119 8.34548 12.7748 8.43159 12.717C8.5177 12.6592 8.58934 12.5823 8.64095 12.4924C9.65472 10.7265 10.9171 9.11548 12.3894 7.70888Z"
							fill="#70778C"
						/>
					</svg>
					Henüz bir bakım rapor edilmemiş.
				</div>
			) : (
				maintenances?.map((maintenance) => (
					<React.Fragment key={maintenance.id}>
						<div className="px-7 py-3 bg-[#F5F5F7] dark:bg-[#21242D] flex justify-between  text-sm text-[#70778C] dark:text-[#E2E4E9]/50">
							<div className="font-medium">
								{format(
									new Date(maintenance.scheduled_start_time as Date),
									"dd MMMM yyyy",
									{
										locale: tr,
									},
								)}
							</div>
							<div>1 Olay</div>
						</div>
						<Maintenance maintenance={maintenance} />
					</React.Fragment>
				))
			)}
		</div>
	);
}
