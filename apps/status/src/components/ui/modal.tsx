"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { create } from "zustand";

import { useEventListener } from "@myy/shared/hooks";
import { Button } from "@myy/ui/button";
import { cn } from "@myy/ui/cn";

type ModalState = {
	open: boolean;
	toggle: () => void;
	set: (open: boolean) => void;
};

export const useModal = create<ModalState>()((set) => ({
	open: false,
	toggle: () => set((state) => ({ open: !state.open })),
	set: (open) => set({ open }),
}));

type ModalProps = {
	children: React.ReactNode;
	header: React.ReactNode;
	className?: string;
	buttonClassName?: string;
	trigger?: string;
};

export function Modal({
	children,
	header,
	className,
	buttonClassName,
	trigger,
}: Readonly<ModalProps>) {
	const open = useModal((state) => state.open);
	const setOpen = useModal((state) => state.set);
	const [mounted, setMounted] = React.useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	useEventListener("keydown", (e) => {
		if (open && e.key === "Escape") setOpen(false);
	});

	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
	}, [open]);

	const modalContent = (
		<>
			<AnimatePresence>
				{open && (
					<>
						<motion.div
							key="backdrop"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="fixed inset-0 z-[101] bg-black/40 backdrop-blur-lg"
							aria-hidden="true"
							onClick={() => setOpen(false)}
						/>
						<div className="fixed inset-x-4 bottom-4 z-[102] flex items-center justify-center overflow-y-auto md:inset-0 scrollbar-hide">
							<motion.div
								key="modal"
								initial={{ opacity: 0, y: 50 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 50 }}
								transition={{ duration: 0.3 }}
								className={cn(
									"w-full max-w-lg rounded bg-white p-6 shadow-xl dark:bg-statuspage-neutral-800 border border-statuspage-neutral-80 dark:border-statuspage-neutral-700 flex flex-col items-center justify-between",
									className,
								)}
								onClick={(e) => e.stopPropagation()}
								aria-modal="true"
							>
								{header && (
									<div className="mb-8 flex w-full flex-row items-center justify-between gap-x-2 text-lg font-bold">
										{header}
										<Button
											size="icon"
											variant="ghost"
											onClick={() => setOpen(false)}
										>
											<X size="24" className="cursor-pointer" />
										</Button>
									</div>
								)}
								{children}
							</motion.div>
						</div>
					</>
				)}
			</AnimatePresence>
		</>
	);

	return (
		<>
			{buttonClassName ? (
				<button
					type="button"
					onClick={() => setOpen(true)}
					className={buttonClassName}
				>
					{trigger}
				</button>
			) : (
				<Button type="button" variant="outline" onClick={() => setOpen(true)}>
					{trigger}
				</Button>
			)}
			{mounted && createPortal(modalContent, document.body)}
		</>
	);
}
