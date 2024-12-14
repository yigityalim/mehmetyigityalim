export default async function Edit({
	params,
}: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return <div>edit form: {id}</div>;
}
