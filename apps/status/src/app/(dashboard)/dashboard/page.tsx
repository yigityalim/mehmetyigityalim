"use client";
import { Modal } from "@/components/ui/modal";
import { Button } from "@myy/ui/button";
import type React from "react";

export default function DashboardPage() {
	const isClosed = true;
	return (
		<div>
			dashboarda
			<Modal header="Abone Ol" trigger="Abone Ol" className="min-h-[50dvh]">
				<div className="w-full flex flex-col gap-4 items-center justify-center">
					<h1 className="text-2xl font-semibold">Edit Incident</h1>
					<p className="text-gray-500 italic">#test</p>
				</div>
			</Modal>
		</div>
	);
}
