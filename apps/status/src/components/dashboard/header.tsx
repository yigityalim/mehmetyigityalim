"use client";

import { Button } from "@myy/ui/button";
import { cn } from "@myy/ui/cn";
import { useTheme } from "@myy/ui/theme";
import { AnimatePresence, motion } from "framer-motion";
import { Component, FileBox, Flame, Layers2, Layers3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { createPortal } from "react-dom";
import { create } from "zustand";

const headerState = create<{
	open: boolean;
	toggle: () => void;
	set: (open: boolean) => void;
}>()((set) => ({
	open: false,
	toggle: () => set((state) => ({ open: !state.open })),
	set: (open) => set({ open }),
}));

function ToggleButton() {
	const open = headerState((state) => state.open);
	const toggle = headerState((state) => state.toggle);
	return (
		<Button
			className="md:hidden inline-flex flex-col items-end justify-center gap-1.5 px-1.5 rounded z-[51]"
			size="icon"
			variant="ghost"
			onClick={toggle}
			aria-expanded={open}
		>
			<span className="sr-only">Toggle Sidebar</span>
			<motion.span
				className="w-6 h-0.5 bg-current"
				animate={{
					rotate: open ? 45 : 0,
					translateY: open ? 8 : 0,
				}}
				transition={{ duration: 0.3 }}
			/>
			<motion.span
				className="w-6 h-0.5 bg-current"
				animate={{
					opacity: open ? 0 : 1,
				}}
				transition={{ duration: 0.3 }}
			/>
			<motion.span
				className="w-4 h-0.5 bg-current"
				animate={{
					rotate: open ? -45 : 0,
					translateY: open ? -8 : 0,
					width: open ? 24 : 14,
				}}
				transition={{ duration: 0.3 }}
			/>
		</Button>
	);
}

export function DashboardHeader() {
	const open = headerState((state) => state.open);
	const setOpen = headerState((state) => state.set);
	const { mounted, config } = useTheme();
	const pathname = usePathname();
	const themeCounter = React.useRef(0);

	React.useEffect(() => {
		const main = document.querySelector("main");
		if (open) {
			//main?.style.setProperty("scale", "0.9");
		}

		return () => {
			//main?.removeAttribute("style");
		};
	}, [open]);

	const overlayMenuContent = (
		<AnimatePresence>
			{open && (
				<>
					<motion.div
						key="backdrop"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
						aria-hidden="true"
						onClick={() => setOpen(false)}
					/>
					<motion.div
						key="sidebar"
						initial={{ x: "-100%" }}
						animate={{ x: 0 }}
						exit={{ x: "-100%" }}
						transition={{ duration: 0.3 }}
						className="fixed inset-y-4 left-4 rounded z-50 w-64 bg-white dark:bg-zinc-900 shadow-xl pt-16"
					>
						<nav className="flex h-[calc(100%-2.25rem)] flex-col gap-2 items-start justify-start p-6">
							{dashboardMenu.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									onClick={() => setOpen(false)}
									className={cn(
										"w-full inline-flex gap-x-2 items-center justfiy-start px-4 py-2 rounded",
										pathname.startsWith(item.href)
											? "bg-black text-white dark:bg-white dark:text-black"
											: "text-zinc-500 dark:text-zinc-400 hover:bg-black/10 transition-colors",
									)}
								>
									{item.icon && <item.icon size={16} />}
									<span>{item.name}</span>
								</Link>
							))}
						</nav>
						<div className="flex flex-row w-full items-center justify-between">
							<Button variant="ghost" className="w-full">
								User
							</Button>
							{mounted && (
								<Button
									variant="ghost"
									className="w-full rounded-br"
									onClick={() => {
										themeCounter.current++;
										// bu themeCounter değerine göre, sırayla tıklamalarada: light, dark, system modları arasında geçiş yapılabilir.
										// 0: light, 1: dark, 2: system
										if (themeCounter.current > 2) {
											themeCounter.current = 0;
										}
										config.setTheme(
											themeCounter.current === 0
												? "light"
												: themeCounter.current === 1
													? "dark"
													: "system",
										);
									}}
								>
									{config.theme === "light"
										? "Dark Mode"
										: config.theme === "dark"
											? "Light Mode"
											: "System Mode"}
								</Button>
							)}
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);

	return (
		<header className="w-full flex flex-row gap-x-2 items-center justify-between bg-white dark:bg-zinc-900 rounded p-2">
			<ToggleButton />
			<Image
				src="/next.svg"
				alt="Logo"
				width={100}
				height={36}
				className="dark:invert"
			/>
			{mounted ? createPortal(overlayMenuContent, document.body) : null}
		</header>
	);
}

const dashboardMenu = [
	{
		name: "Olaylar",
		href: "/dashboard/incidents",
		icon: Flame,
	},
	{
		name: "Komponentler",
		href: "/dashboard/components",
		icon: Component,
	},
	{
		name: "Komponent Grupları",
		href: "/dashboard/components/groups",
		icon: Layers2,
	},
	{
		name: "Durum sayfaları",
		href: "/dashboard/pages",
		icon: FileBox,
	},
];
