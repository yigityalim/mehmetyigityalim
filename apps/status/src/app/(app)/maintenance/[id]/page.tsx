import { BackButton } from "@/components/back-button";
import { Icons } from "@/components/icons";
import { HoverCard } from "@/components/ui/hover-card";
import { maintenanceText } from "@/lib/status-utils";
import { services } from "@/db/services";
import { cn } from "@myy/ui/cn";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MaintenancePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const maintenance =
		await services.scheduledMaintenance.getScheduledMaintenance(id);

	if (!maintenance) {
		return notFound();
	}

	console.log(maintenance.updates);

	// FIXME: change colors

	return (
		<div className="w-full h-full px-4 py-6 text-[#8A91A5]">
			<BackButton />
			<div className="mt-4 dark:bg-[#191C24] border border-[#E2E4E9] dark:border-[#21242D] rounded-lg shadow-small overflow-hidden">
				<div className="p-8">
					<div className="inline-block px-2.5 py-1.5 rounded-full leading-none text-[#0369A1] bg-[#0369A1]/20">
						{maintenanceText[maintenance.status]}
					</div>

					<h2 className="mt-3 text-2xl font-bold text-[#191C24] dark:text-white max-w-[420px]">
						{maintenance.name}
					</h2>
					<div className="mt-3 font-medium text-sm text-[#70778C] dark:text-[#E2E4E9]/50">
						{format(
							new Date(maintenance.scheduled_start_time as Date),
							"dd MMMM yyyy, HH:mm",
							{
								locale: tr,
							},
						)}
					</div>
					<div className="mt-3 font-medium text-sm text-[#70778C] dark:text-[#E2E4E9]/50">
						Son güncelleme tarihi:{" "}
						{format(
							new Date(maintenance.updated_at as Date),
							"dd MMMM yyyy, HH:mm",
							{
								locale: tr,
							},
						)}
					</div>
				</div>
				<div className="px-8 py-4 flex flex-wrap items-center font-medium border-t whitespace-nowrap border-[#E2E4E9]/50 dark:border-[#21242D]">
					<div className="mr-4">Etkilenen servisler</div>
					<Link
						href="#" //{`/component/${maintenance.component.id}`}
						className="bg-[#F5F5F7] dark:bg-[#2D313C] mr-2 my-1 px-2 py-1 rounded-full"
					>
						{maintenance.component.name}
					</Link>
				</div>
				<div className="px-8 pt-4 pb-6 bg-statuspage-neutral-40 dark:bg-[#151820]">
					{maintenance.updates
						.sort(
							(a, b) =>
								new Date(b.created_at as Date).getTime() -
								new Date(a.created_at as Date).getTime(),
						)
						.map((update, index) => (
							<div className="mt-3 flex" key={update.id}>
								<div className="shrink-0 relative mt-4 mr-2">
									{update.status === "resolved" ||
									update.status === "closed" ? (
										<Icons.resolved
											className={cn({
												"text-[#B83280]": update.status === "closed",
												"text-[#10B981]": update.status === "resolved",
											})}
										/>
									) : (
										<Icons.blank
											className={cn({
												"text-[#F59E0B]": update.status === "identified",
												"text-[#D97706]": update.status === "investigating",
												"text-[#4ADE80]": update.status === "monitoring",
												"text-[#F87171]": update.status === "detected",
											})}
										/>
									)}

									{maintenance.updates.length > 1 && (
										<div className="absolute top-7 left-2 -bottom-2 border-l dark:border-[#21242D] border-[#E2E4E9]/50" />
									)}
								</div>
								<div className="mb-1 grow relative min-w-0">
									<div className="px-4 pt-4 relative z-20 border rounded-lg shadow-small bg-white dark:bg-[#21242D] border-[#E2E4E9] dark:border-[#2D313C]">
										<div className="flex items-start">
											<p className="grow">
												<span className="font-medium text-[#191C24] dark:text-white">
													{update.title}
												</span>
												<br className="sm:hidden" />
												<span className="ml-1">
													{format(
														new Date(update.created_at as Date),
														"dd MMMM yyyy, HH:mm",
														{
															locale: tr,
														},
													)}
												</span>
											</p>
											<HoverCard
												trigger={<Icons.info />}
												content={
													<div className="w-full flex flex-col gap-y-2">
														<div className="w-full">
															<p className="px-2 py-1 text-[#8A91A5]">
																Etkilenen Servisler
															</p>
															<hr className="my-1 border-b border-t-0 border-[#E2E4E9]/50 dark:border-[#2D313C]" />
															<div className="mx-2">
																<p className="py-2 whitespace-nowrap font-medium text-[#424757] dark:text-[#A7ACBB]">
																	<Icons.warning />
																	<Link
																		href="#" //{`/components/${component.[hash]}`}
																		className="ml-1 hover:underline cursor-pointer"
																	>
																		{maintenance.component.name}
																	</Link>
																</p>
															</div>
														</div>
													</div>
												}
											/>
										</div>
										<div className="my-3 w-full prose-sm prose-status-page">
											<p>{update.content}</p>
										</div>
									</div>
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
