import services from "@/server/services";
import { notFound } from "next/navigation";

export default async function GroupPage({
	params,
}: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const componentGroup =
		await services.componentGroup.getComponentGroupById(id);

	if (!componentGroup) notFound();

	return (
		<div className="max-w-7xl mx-auto p-6 lg:p-12 overflow-y-hidden overflow-x-scroll">
			<div className="flex items-center justify-between mb-10" />
			<div className=" mb-10 flex flex-col space-y-6 md:space-y-0 md:flex-row md:items-center md:justify-between">
				<div className="z-10">
					<h2 className="text-2xl leading-6 font-medium text-gray-900 dark:text-zinc-200">
						{componentGroup.name}
					</h2>
					<p className="mt-2 max-w-4xl text-sm text-zinc-700 dark:text-zinc-400">
						{componentGroup.published ? "Yayında" : "Yayında değil"}
					</p>
				</div>
			</div>
		</div>
	);
}
