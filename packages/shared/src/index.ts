import crypto from "node:crypto";
import _ from "lodash"
export { _, crypto };

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomString(length = 10) {
	return crypto.randomBytes(length).toString("hex");
}
