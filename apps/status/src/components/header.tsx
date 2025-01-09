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
import Image from "next/image";

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
					<NextLink href="/" className="inline-flex gap-x-2 flex-row items-center font-bold">
						<Image src="/yigityalim.png" alt="Mehmet Yiğit Yalım" width={40} height={40} className="rounded-full w-6" />
						Yiğit Yalım - Status
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
	children,
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
			{children}
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
	{
		name: "Dashboard (DEVELOPMENT)",
		href: "/dashboard",
	}
].map((item) => (item.primary ? item : { ...item, primary: false }));
