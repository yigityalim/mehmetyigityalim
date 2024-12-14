//
// JSON types
//

/**
 * JSONPrimitive tipi JSON veri türlerini temsil eder.
 */
export type JSONPrimitive = string | number | boolean | null;

/**
 * JSONArray tipi JSON dizilerini temsil eder.
 */
export type JSONArray = (JSONPrimitive | JSONObject | JSONArray)[];

/**
 * JSONObject tipi JSON nesnelerini temsil eder.
 */
export type JSONObject = {
	[key: string]: JSONPrimitive | JSONObject | JSONArray | object | InvalidJSON;
};

/**
 * JSONValue tipi JSON veri türlerini temsil eder.
 *
 * @example
 * ```ts
 * const value: JSONValue = {
 *    name: "John Doe",
 *    age: 30,
 *    isStudent: false,
 *    subjects: ["Math", "Science"],
 *    address: {
 *        city: "New York",
 *        country: "USA",
 *    },
 *    contact: {
 *        email: "",
 *        phone: "+1234567890",
 *    },
 *    isEmployed: null,
 *    isMarried: undefined,
 *    isRetired: () => true,
 *    [Symbol("symbol")]: "Symbol",
 *    invalid: new Map(),
 *  };
 */
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;

/**
 * InvalidJSON tipi geçersiz JSON veri türlerini temsil eder.
 */
export type InvalidJSON =
	| undefined
	| symbol
	| ((...args: unknown[]) => unknown);

//
// Utility types
//
/**
 * Expect<T> tipi T tipine eşitse true, değilse false döndürür.
 *
 * @example
 * ```ts
 * type A = Expect<true>; // true olarak değerlendirilir
 * type B = Expect<false>; // false olarak değerlendirilir
 * ```
 */
export type Expect<T extends true> = T;

/**
 * Equal<X, Y> tipi X ve Y tiplerinin eşit olup olmadığını kontrol eder. Eşitse true, değilse false döndürür.
 *
 * @example
 * ```ts
 * type A = Equal<true, false>; // false olarak değerlendirilir
 * ```
 */
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
	T,
>() => T extends Y ? 1 : 2
	? true
	: false;

/**
 * NotEqual<X, Y> tipi X ve Y tiplerinin eşit olup olmadığını kontrol eder. Eşitse false, değilse true döndürür.
 *
 * @example
 * ```ts
 * type A = NotEqual<true, false>; // true olarak değerlendirilir
 * ```
 */
export type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true;

/**
 * Merge<M, N> tipi M ve N tiplerini birleştirir. Eğer M ve N tiplerinde aynı isimde bir property varsa, M tipindeki property N tipindeki property ile değiştirilir.
 *
 * @example
 * ```ts
 * type A = Merge<{ a: number; b: string }, { a: string; c: boolean }>; // { a: string; b: string; c: boolean }
 * ```
 */
export type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

/**
 * OptionalExceptFor<T, TRequired> tipi T tipindeki property'lerin hepsini optional yapar, ancak TRequired tipindeki property'lerin required olmasını sağlar.
 *
 * @example
 * ```ts
 * type A = OptionalExceptFor<{ a: number; b: string }, "a">; // { a: number; b?: string }
 * ```
 *
 * @example
 * ```ts
 * type B = OptionalExceptFor<{ a: number; b: string }, "a" | "b">; // { a?: number; b?: string }
 * ```
 *
 * @example
 * ```ts
 * type C = OptionalExceptFor<{ a: number; b: string }, "c">; // { a?: number; b?: string }
 * ```
 */
export type OptionalExceptFor<T, TRequired extends keyof T> = Partial<
	Omit<T, TRequired>
> &
	Required<Pick<T, TRequired>>;

/**
 * RequiredExceptFor<T, TOptional> tipi T tipindeki property'lerin hepsini required yapar, ancak TOptional tipindeki property'lerin optional olmasını sağlar.
 *
 * @example
 * ```ts
 * type A = RequiredExceptFor<{ a: number; b?: string }, "b">; // { a: number; b: string }
 * ```
 */
export type RequiredExceptFor<T, TOptional extends keyof T> = Required<
	Omit<T, TOptional>
> &
	Partial<Pick<T, TOptional>>;

/**
 * XOR<T, U> tipi T ve U tiplerinden sadece bir tanesini içeren bir tip döndürür.
 *
 * @example
 * ```ts
 * type A = XOR<{ a: number }, { b: string }>; // { a: number } | { b: string }
 * ```
 */
export type XOR<T, U> = T | U extends object // T ve U tipleri object tipinde ise
	? (Without<T, U> & U) | (Without<U, T> & T) // T ve U tiplerinden birini döndür
	: T | U; // T ve U tiplerinden birini döndür

/**
 * Without<T, U> tipi T tipindeki property'lerden U tipindeki property'leri çıkarır.
 *
 * @example
 * ```ts
 * type A = Without<{ a: number; b: string }, { b: string }>; // { a: number }
 * ```
 *
 * @example
 * ```ts
 * type B = Without<{ a: number; b: string }, { c: boolean }>; // { a: number; b: string }
 * ```
 */
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
