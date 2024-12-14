import services from "@/server/services";
import { buttonVariants } from "@myy/ui/button";
import { cn } from "@myy/ui/cn";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function ComponentGroupsPage() {
	const allComponentGroups =
		await services.componentGroup.listComponentGroups();
	return (
		<div className="max-w-7xl mx-auto p-6 lg:p-12 overflow-y-hidden overflow-x-scroll">
			<div className="flex items-center justify-between mb-10" />
			<div className=" mb-10 flex flex-col space-y-6 md:space-y-0 md:flex-row md:items-center md:justify-between">
				<div className="z-10">
					<h2 className="text-2xl leading-6 font-medium text-gray-900 dark:text-zinc-200">
						Komponent Grupları
					</h2>
					<p className="mt-2 max-w-4xl text-sm text-zinc-700 dark:text-zinc-400">
						Mevcut proje için yeni bir komponent grubu oluşturun. Bu,
						projenizdeki bir hizmet, sunucu veya uygulama grubu olabilir.
						Uygulamaları gruplama için bunu zorunlu kılıyoruz.
					</p>
				</div>
				<div className="flex items-center justify-between">
					<Link
						className={buttonVariants({ variant: "outline" })}
						href="/dashboard/components/groups/create"
					>
						<Plus size={16} className="mr-2" />{" "}
						<span>Yeni bir komponent oluştur</span>
					</Link>
				</div>
			</div>
			<div>
				{allComponentGroups.length > 0 ? (
					allComponentGroups.map((group) => (
						<div
							key={group.id}
							className="flex items-center justify-between w-full px-4 py-2 bg-white dark:bg-zinc-800 rounded-md shadow-md"
						>
							<div className="flex items-center space-x-4">
								<div>
									<h3 className="text-lg font-medium text-gray-900 dark:text-zinc-200">
										{group.name}
									</h3>
									<p
										className={cn(
											"text-sm",
											group.published
												? "text-green-500 dark:text-green-400"
												: "text-red-500 dark:text-red-400",
										)}
									>
										{group.published ? "Yayında" : "Yayında değil"}
									</p>
								</div>
							</div>
							<div>
								<Link
									className={buttonVariants({ variant: "outline" })}
									href="/dashboard/components/groups/[id]"
									as={`/dashboard/components/groups/${group.id}`}
								>
									Detaylar
								</Link>
							</div>
						</div>
					))
				) : (
					<div className="flex items-center justify-center w-full h-64 text-gray-500 dark:text-zinc-400">
						Hiçbir komponent grubu bulunamadı.
					</div>
				)}
			</div>
		</div>
	);
}
