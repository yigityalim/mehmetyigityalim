import { methodNotAllowed } from "@/lib/utils";
import services from "@/server/services";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const requestUrl = new URL(req.url);
	const filters = !!requestUrl.searchParams.get("filter"); // FIXME: add filter

	const allSystems = await services.utils.getSystemStatus({
		filters: { status: filters },
	});

	return new NextResponse(JSON.stringify(allSystems), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;

export function OPTIONS(req: NextRequest) {
	return new NextResponse(null, {
		status: 204,
		headers: {
			"Access-Control-Allow-Methods": "GET",
		},
	});
}

export function HEAD(req: NextRequest) {
	return new NextResponse(null, {
		status: 204,
	});
}
