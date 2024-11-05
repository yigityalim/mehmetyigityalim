import crypto from "node:crypto";

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomString(length = 10) {
	return crypto.randomBytes(length).toString("hex");
}
