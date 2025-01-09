import "db-only";

export type Data =
	| string
	| boolean
	| number
	| object
	| ArrayBuffer
	| ArrayBufferView;

export type Algorithm = {
	name: "SHA-256" | "SHA-384" | "SHA-512";
	alias?: string;
};

/**
 * Creates a hash. This function works if `crypto.subtle` is available in the browser.
 * @param data Data to be hashed
 * @param algorithm Hash algorithm
 *
 * @returns Hash value
 *
 * @example
 * ```ts
 * const hash = await createHash("Hello World", { name: "SHA-256" });
 * console.log(hash); // 2ef7bde608ce5404e97d5f042f95f89f1c232871d3d6f8d5566b0b506f7edf7d -> SHA-256
 * ```
 * @see {@link sha256}
 */
export async function createHash(
	data: Data,
	algorithm: Algorithm,
): Promise<string> {
	if (!crypto?.subtle) {
		throw new Error("Crypto API is not available");
	}

	let sourceBuffer: ArrayBuffer;
	if (ArrayBuffer.isView(data) || data instanceof ArrayBuffer) {
		sourceBuffer = ArrayBuffer.isView(data) ? data.buffer : data;
	} else {
		const _data =
			typeof data === "object" ? JSON.stringify(data) : String(data);
		sourceBuffer = new TextEncoder().encode(_data);
	}

	const buffer = await crypto.subtle.digest(algorithm.name, sourceBuffer);
	return Array.from(new Uint8Array(buffer))
		.map((x) => x.toString(16).padStart(2, "0"))
		.join("");
}

export const sha256 = (data: Data): Promise<string> =>
	createHash(data, { name: "SHA-256", alias: "sha256" });

export const sha384 = (data: Data): Promise<string> =>
	createHash(data, { name: "SHA-384", alias: "sha384" });

export const sha512 = (data: Data): Promise<string> =>
	createHash(data, { name: "SHA-512", alias: "sha512" });

export function randomBytes(length = 32): Uint8Array {
	if (!crypto?.getRandomValues) {
		throw new Error("Crypto API is not available");
	}
	return crypto.getRandomValues(new Uint8Array(length));
}

export function randomString(length = 32): string {
	if (length <= 0) return "";
	const charset =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	const randomValues = randomBytes(length);
	return Array.from(randomValues, (x) => charset[x % charset.length]).join("");
}
