export type ServiceFunctionReturnType<
	Service,
	K extends keyof Service,
> = Service[K] extends (...args: any[]) => infer R ? R : never;

export type MaybePromise<T> = Promise<T>;
