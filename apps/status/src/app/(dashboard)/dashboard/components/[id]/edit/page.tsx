import services from "@/db/services";
import { notFound } from "next/navigation";

export default async function ComponentEditPage({
	params,
}: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const component = await services.component.getComponentById(id);

	if (!component) notFound();

	return <div>{component.name}</div>;
}
