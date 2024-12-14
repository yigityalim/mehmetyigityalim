"use client";

import { Button, buttonVariants } from "@myy/ui/button";
import { cn } from "@myy/ui/cn";
import { Popover, PopoverContent, PopoverTrigger } from "@myy/ui/popover";
import { ChevronRight, PencilOffIcon, TrashIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Modal, useModal } from "@/components/ui/modal";

type Action = {
	icon: LucideIcon;
	text: string;
	href?: string;
	onClick?: () => void;
	variant: "delete" | "button";
};

function DeleteConfirmationModal({ name }: { name: string }) {
	const setModalOpen = useModal((state) => state.set);
	const isModalOpen = useModal((state) => state.open);
	const [regex, setRegex] = React.useState("");
	const [valid, setValid] = React.useState(false);

	const handleDelete = () => {
		if (!valid) return;
		console.log("Deleting incident");
		setRegex("");
		setValid(false);
		setModalOpen(false);
	};

	const validRegex = new RegExp(`^Delete ${name}$`, "i");

	React.useEffect(() => {
		setValid(validRegex.test(regex));
	}, [regex]);

	return (
		<Modal header="Silmeyi Doğrula">
			<p>
				Bu aksiyon geri alınamaz. {name} olayı, zaman çizelgesi geçmişi dahil
				olmak üzere tüm ilişkili verilerle birlikte kalıcı olarak silinecek.
				Yayınlandığı tüm durum sayfalarından olay kaybolacak.
			</p>
			<div className="my-8 w-full flex flex-col gap-2 items-start justify-start">
				<p className="">
					<span className="font-bold">{`Delete ${name}`}</span> yazarak silmeyi
					onaylayın.
				</p>
				<input
					type="text"
					className="w-full p-2 border border-gray-300 rounded"
					placeholder={`Delete ${name}`}
					value={regex}
					onChange={(e) => setRegex(e.target.value)}
				/>
			</div>
			<div className="w-full mt-4 flex justify-between items-center gap-x-2">
				<Button variant="outline" onClick={() => setModalOpen(false)}>
					İptal
				</Button>
				<Button variant="destructive" onClick={handleDelete} disabled={!valid}>
					Sil
				</Button>
			</div>
		</Modal>
	);
}

export function IncidentActionsDropdown() {
	const id = 1;
	const setModalOpen = useModal((state) => state.set);

	const actions: Action[] = [
		{
			icon: PencilOffIcon,
			text: "Düzenle",
			href: `/dashboard/incidents/${id}/edit`,
			variant: "button",
		},
		{
			icon: TrashIcon,
			text: "Sil",
			onClick: () => setModalOpen(true),
			variant: "delete",
		},
	];

	return (
		<>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className="inline-flex items-center gap-x-2 rounded"
					>
						<span>Aksiyonlar</span>
						<ChevronRight className="rotate-90" size={16} />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-24 rounded p-0 z-30">
					<ul>
						{actions.map(({ icon, text, href, onClick, variant }) => {
							const isLink = !!href;
							const Component = isLink ? Link : Button;
							const Icon = icon;
							return (
								<li key={text}>
									<Component
										href={href as string}
										variant="ghost"
										size="sm"
										onClick={onClick}
										className={cn(
											isLink &&
												buttonVariants({ size: "sm", variant: "ghost" }),
											"inline-flex w-full items-center justify-between gap-x-2",
											{
												"text-red-500 hover:text-red-700": variant === "delete",
											},
										)}
									>
										<Icon size={16} /> {text}
									</Component>
								</li>
							);
						})}
					</ul>
				</PopoverContent>
			</Popover>
			<DeleteConfirmationModal name="TEST_4" />
		</>
	);
}
