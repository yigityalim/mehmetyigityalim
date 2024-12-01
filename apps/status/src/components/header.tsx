"use client";
import { Modal, useModal } from "@/components/ui/modal";
import { useForm, zodResolver } from "@myy/shared/form";
import { useEventListener } from "@myy/shared/hooks";
import { Button } from "@myy/ui/button";
import { cn } from "@myy/ui/cn";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@myy/ui/form";
import { Input } from "@myy/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { z } from "zod";
import { create } from "zustand";

export const useHeader = create<{
	open: boolean;
	setOpen: (open: boolean) => void;
	close: () => void;
}>()((set) => ({
	open: false,
	setOpen: (open: boolean) => set({ open }),
	close: () => set({ open: false }),
}));

export function Header() {
	const open = useHeader((state) => state.open);
	const setOpen = useHeader((state) => state.setOpen);

	useEventListener("click", (event) => {
		const target = event.target as HTMLElement;
		if (!target.closest("header")) {
			setOpen(false);
		}
	});

	return (
		<>
			<motion.header className="container mx-auto max-w-4xl md:static w-full fixed top-0 inset-x-0 z-[100] flex flex-col items-center justify-between px-4 py-3 backdrop-blur-xl bg-white/80 dark:bg-statuspage-neutral-900/80 border border-[#E2E4E9]/50 md:border-x-0 md:border-t-0 dark:border-statuspage-neutral-700">
				<div className="w-full flex flex-row gap-x-2 items-center justify-between">
					<NextLink href="/">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 394 80"
							className="object-contain w-20"
						>
							<title>Next.js Logo</title>
							<path
								className="fill-dark dark:fill-white"
								d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"
							/>
							<path
								className="fill-dark dark:fill-white"
								d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"
							/>
						</svg>
					</NextLink>
					<div className="hidden md:flex flex-row items-center justify-center gap-x-4">
						{headerMenu.map((item) => (
							<Link key={item.name} {...item}>
								{item.name}
							</Link>
						))}
					</div>
					<div className="ml-auto md:ml-0 flex items-center justify-end gap-x-2">
						<Dialog />
						<ChevronDown
							className={cn(
								"block size-6 transition duration-300 md:hidden",
								open && "transform rotate-180",
							)}
							onClick={() => setOpen(!open)}
						/>
					</div>
				</div>
				<AnimatePresence>
					<motion.div
						style={{ overflow: "hidden" }}
						initial="close"
						animate={open ? "open" : "close"}
						exit="close"
						variants={{
							open: { height: "auto", opacity: 1, paddingTop: 24 },
							close: { height: 0, opacity: 0, paddingTop: 0 },
						}}
						key="header"
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="w-full"
					>
						<motion.div
							initial="close"
							animate={open ? "open" : "close"}
							exit="close"
							variants={{
								open: { opacity: 1, y: 0 },
								close: { opacity: 0, y: -8 },
							}}
							transition={{ duration: 0.5, ease: "easeInOut" }}
							className="inline-flex flex-col gap-2"
						>
							{headerMenu.map((item) => (
								<Link key={item.name} {...item}>
									{item.name}
								</Link>
							))}
						</motion.div>
					</motion.div>
				</AnimatePresence>
			</motion.header>
		</>
	);
}

const formSchema = z.object({
	email: z.string().email("E-posta adresi geçerli değil. Lütfen kontrol edin."),
});

type FormValues = z.infer<typeof formSchema>;

function Dialog() {
	const modalClose = useModal((state) => state.set);
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	function onSubmit({ email }: FormValues) {
		console.log(email);
		form.reset();
		modalClose(false);
	}

	return (
		<Modal
			buttonClassName="block px-3 py-2 bg-statuspage-neutral-40 dark:bg-statuspage-neutral-700 border border-statuspage-neutral-80 dark:border-statuspage-neutral-600 rounded shadow-small text-statuspage-neutral-800 dark:text-white font-medium leading-none whitespace-nowrap -my-[6px] mr-2"
			header="Abone Ol"
			trigger="Abone Ol"
			className="min-h-[50dvh]"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>E-posta</FormLabel>
								<FormControl>
									<Input
										placeholder="test@gmail.com"
										{...field}
										className={cn(
											"placeholder-opacity-50",
											form.formState.errors.email &&
												"border-red-500 text-ted-900 dark:border-red-900 bg-red-50 dark:bg-red-500 placeholder-opacity-100 focus-visible:ring-red-500 dark:focus-visible:ring-red-900",
										)}
									/>
								</FormControl>
								<FormDescription>
									Bu formu doldurarak bültenimize abone olabilirsiniz.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						disabled={!form.formState.isValid}
						className="w-full disabled:pointer-events-none"
					>
						Abone Ol
					</Button>
				</form>
			</Form>
			<div className="mt-auto w-full">
				<h3 className="text-sm font-bold text-ted-900 dark:text-ted-100 w-full text-start">
					Diğer Seçenekler
				</h3>
				<div className="flex gap-4 mt-2 w-full">
					<Button
						variant="outline"
						onClick={() => modalClose(false)} // TODO: Implement RSS
						className="w-full"
					>
						RSS
					</Button>
					<Button
						variant="outline"
						onClick={() => modalClose(false)} // TODO: Implement Webhook
						className="w-full"
					>
						Webhook
					</Button>
					<Button
						variant="outline"
						onClick={() => modalClose(false)} // TODO: Implement JSON
						className="w-full"
					>
						JSON
					</Button>
				</div>
			</div>
		</Modal>
	);
}

function Link({
	href,
	primary,
	...props
}: Readonly<React.PropsWithChildren<{ href: string; primary: boolean }>>) {
	const close = useHeader((state) => state.close);
	const isActive = usePathname() === href;
	const Component = isActive ? "span" : NextLink;
	return (
		<Component
			href={(isActive ? undefined : href) as string}
			onClick={close}
			className={cn(
				"w-fit px-2.5 py-1.5 inline-flex items-center justify-center text-xs rounded-full transition",
				"hover:bg-gray-100 dark:hover:bg-gray-800",
				isActive && "bg-statuspage-neutral-60 dark:bg-statuspage-neutral-700",
			)}
		>
			{props.children}
		</Component>
	);
}

const headerMenu = [
	{
		name: "Anlık Durum",
		href: "/",
	},
	{
		name: "Bakım",
		href: "/maintenance",
	},
	{
		name: "Geçmiş Olaylar",
		href: "/incidents",
	},
	{
		primary: true,
		name: "Mehmet Yiğit Yalım",
		href: "https://mehmetyigityalim.com",
	},
].map((item) => (item.primary ? item : { ...item, primary: false }));
