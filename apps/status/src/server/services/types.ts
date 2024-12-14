export type ServiceFunctionReturnType<
	Service,
	K extends keyof Service,
> = Awaited<ReturnType<Service[K]>>;

export type MaybePromise<T> = Promise<T>;
