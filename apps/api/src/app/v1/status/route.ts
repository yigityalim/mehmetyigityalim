import { type NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
	return NextResponse.json<{ status: string }>(
		{ status: "ok" },
		{ status: 200 },
	);
}

export async function POST(req: NextRequest) {
	const body = (await req.json()) as { id: string };
	return NextResponse.json(body, { status: 201 });
}

export async function PUT(req: NextRequest) {
	const body = (await req.json()) as { id: string };
	return NextResponse.json(body, { status: 200 });
}

export async function PATCH(req: NextRequest) {
	const body = (await req.json()) as { id: string };
	return NextResponse.json(body, { status: 200 });
}

export async function DELETE(req: NextRequest) {
	const body = (await req.json()) as { id: string };
	return NextResponse.json(body, { status: 200 });
}
