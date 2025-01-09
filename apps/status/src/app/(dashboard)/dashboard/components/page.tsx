import services from "@/db/services";
import { buttonVariants } from "@myy/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function ComponentsPage() {
	const allComponents = await services.component.listComponents();
	return (
		<div className="max-w-7xl mx-auto p-6 lg:p-12 overflow-y-hidden overflow-x-scroll">
			<div className="flex items-center justify-between mb-10" />
			<div className=" mb-10 flex flex-col space-y-6 md:space-y-0 md:flex-row md:items-center md:justify-between">
				<div className="z-10">
					<h2 className="text-2xl leading-6 font-medium text-gray-900 dark:text-zinc-200">
						Komponentler
					</h2>
					<p className="mt-2 max-w-4xl text-sm text-zinc-700 dark:text-zinc-400">
						Websiteleriniz ve sunucularınız için güvenilir çalışma süresi
						izlemesi.
					</p>
				</div>
				<div className="flex items-center justify-between">
					<Link
						className={buttonVariants({ variant: "outline" })}
						href="/dashboard/components/create"
					>
						<Plus size={16} className="mr-2" />{" "}
						<span>Yeni bir komponent oluştur</span>
					</Link>
				</div>
			</div>
			<div className="flex flex-col gap-6">
				{allComponents.map((component) => (
					<div key={component.id} className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-semibold">{component.name}</h3>
							<p className="text-sm text-gray-500">{component.description}</p>
						</div>
						<div>
							<Link
								href={`/dashboard/components/${component.id}/edit`}
								className="text-blue-500"
							>
								Düzenle
							</Link>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
