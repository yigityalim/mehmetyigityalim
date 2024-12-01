import { services } from "@/server/services";

import { Icons } from "@/components/icons";
import { cn } from "@myy/ui/cn";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import React from "react";
import { LastIncident } from "./last-incident";
import { ServiceStatus } from "./service-status";

export async function Status() {
	const [components, systemStatus, isMaintenance] = await Promise.all([
		services.component.listComponents(),
		services.utils.getSystemStatus({ filters: { date: true } }),
		services.scheduledMaintenance.isMaintenance(),
	]);

	return (
		<React.Suspense fallback={<div>Loading...</div>}>
			<div className="w-full max-w-4xl mx-auto flex flex-col gap-4 items-center justify-start px-6 md:px-0">
				<div
					className={cn(
						"mt-16 mb-4 sm:mt-20 flex flex-col items-center text-center",
						isMaintenance && "mt-4",
					)}
				>
					<Icons.status />
					<h1 className="mt-2 text-3xl font-bold dark:text-white">
						Tüm sistemlerimiz şu anda çalışıyor.
					</h1>
					<p className="mt-3 font-medium">
						En son güncelleme:{" "}
						{format(
							typeof systemStatus === "string"
								? new Date()
								: new Date(systemStatus.lastIncidentDate!.created_at),
							"d MMMM HH:mm",
							{
								locale: tr,
							},
						)}
					</p>
				</div>
				{components ? (
					<div className="w-full flex flex-col items-center justify-center bg-transparent border border-statuspage-neutral-80 dark:border-statuspage-neutral-700 dark:bg-statuspage-neutral-800 rounded-xl">
						<ServiceStatus components={components} />
					</div>
				) : (
					<div className="w-full flex flex-col items-center justify-center bg-neutral-100 dark:bg-[#191C24] px-4 py-2">
						<p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
							Şu anda herhangi bir hizmet kesintisi bulunmamaktadır.
						</p>
					</div>
				)}
			</div>
		</React.Suspense>
	);
}
