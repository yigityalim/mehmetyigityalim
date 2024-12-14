import { cn } from "@myy/ui/cn";
import { Label } from "@myy/ui/label";
import type React from "react";

export function FormItem({
	labelFor,
	label,
	description,
	children,
	...props
}: Readonly<
	React.ComponentPropsWithoutRef<"div"> & {
		labelFor: string;
		label: React.ReactNode;
		description: React.ReactNode;
	}
>) {
	return (
		<div
			className={cn("w-full flex flex-col gap-2", props.className)}
			{...props}
		>
			<label
				htmlFor={labelFor}
				className="block font-medium text-sm text-black dark:text-white mb-2.5"
			>
				{label}
			</label>
			<p className="-mt-1.5 block text-xs text-gray-600 mb-3">{description}</p>
			{children}
		</div>
	);
}
