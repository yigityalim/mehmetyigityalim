import { FormItem } from "@/components/dashboard/form-item";
import services from "@/server/services";
import { Button, buttonVariants } from "@myy/ui/button";
import { Input } from "@myy/ui/input";
import { Label } from "@myy/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@myy/ui/select";
import { Plus } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { redirect } from "next/navigation";
import type React from "react";
import slugify from "react-slugify";

export default async function CreateIncidentPage() {
	const allComponents = await services.component.listComponents();

	return (
		<div className="max-w-7xl mx-auto p-6 lg:p-12 overflow-y-hidden overflow-x-scroll">
			<div className="my-10 flex flex-col space-y-6 md:space-y-0 md:flex-row md:items-center md:justify-between">
				<div className="z-10">
					<h2 className="text-2xl leading-6 font-medium text-gray-900 dark:text-zinc-200">
						Yeni bir olay oluştur
					</h2>
					<p className="mt-2 max-w-4xl text-sm text-zinc-700 dark:text-zinc-400">
						Mevcut proje için yeni bir olay bildirin
					</p>
				</div>
				<div className="pt-14 w-full flex flex-col gap-2 items-center justify-start">
					{allComponents.length > 0 ? (
						<Form
							action={async (formData) => {
								"use server";
								const data = {
									title: formData.get("incident-title") as string,
									slug: slugify(formData.get("incident-title") as string),
									description: formData.get("incident-description") as string,
									visibility: "published" as [
										"published" | "draft" | "archived",
									][number],
									status: formData.get("incident-status") as [
										"detected",
										"investigating",
										"identified",
										"resolving",
										"monitoring",
										"resolved",
										"closed",
									][number],
									impact: "operational" as [
										"unknown",
										"degraded_performance",
										"partial_outage",
										"major_outage",
										"maintenance",
										"operational",
									][number],
									severity: "minor" as [
										"minor",
										"major",
										"critical",
										"maintenance",
									][number],
									started_at: new Date(
										formData.get("incident-start-time") as string,
									),
									message: "Olay oluşturuldu",
								};

								// FIXME: add fields, manage data and add component. we need to add component to incident
								/*
								const response =
									await services.incident.createIncidentWithImpacts(data, [
										formData.get("incident-component") as string,
									]);
								 */

								const response = false; // FIXME: remove this line
								if (response) {
									redirect("/dashboard/incidents");
								}
							}}
							className="w-full flex flex-col gap-6 items-center justify-start"
						>
							<h3 className="w-full text-start text-lg font-medium text-gray-900 dark:text-zinc-200 border-b border-gray-200 dark:border-zinc-200 pb-2">
								Olay bilgileri
							</h3>
							<FormItem
								labelFor="incident-title"
								label="Olay Başlığı"
								description="Olayın kısa bir açıklaması"
							>
								<Input
									name="incident-title"
									placeholder="Örn: Sunucu kesintisi"
								/>
							</FormItem>
							<FormItem
								labelFor="incident-description"
								label={
									<span>
										Olay Açıklaması -
										<span className="font-bold italic text-xs ml-0.5">
											(Opsiyonel)
										</span>
									</span>
								}
								description="Olayın detaylı bir açıklaması"
							>
								<Input
									name="incident-description"
									placeholder="Örn: Sunucu kesintisi yaşandı ve bu süre zarfında kullanıcılarımız hizmet alamadı."
								/>
							</FormItem>
							<FormItem
								labelFor="incident-status"
								label={
									<span>
										Durum sayfası güncellemesi -
										<span className="font-bold italic text-xs ml-0.5">
											(Opsiyonel)
										</span>
									</span>
								}
								description="Kullanıcılarınızı olay hakkında bilgilendirmek için durum sayfanızda bir inceleme güncellemesi yayınlayın."
							>
								<Input
									name="incident-status"
									placeholder="Örn: Sunucu kesintisi yaşandı ve bu süre zarfında kullanıcılarımız hizmet alamadı."
								/>
							</FormItem>
							<FormItem
								labelFor="incident-start-time"
								label="Başlangıç zamanı"
								description="Olayın başlangıç zamanı"
							>
								<Input name="incident-start-time" type="datetime-local" />
							</FormItem>
							<FormItem
								labelFor="incident-component"
								label="Etkilenen komponentler"
								description="Bu olayın etkilediği komponentleri seçin"
							>
								<div className="w-full flex flex-col gap-2 items-start justify-start">
									<Select name="incident-component">
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Komponent seçin" />
										</SelectTrigger>
										<SelectContent>
											{allComponents.map((component) => (
												<SelectItem value={component.id} key={component.id}>
													{component.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</FormItem>
							<Button type="submit" className="w-full">
								Olayı oluştur
							</Button>
						</Form>
					) : (
						<div className="w-full flex flex-col gap-4 items-start justify-center">
							<h1 className="text-lg font-medium text-gray-900 dark:text-zinc-200">
								Henüz bir komponent eklenmemiş.
							</h1>
							<p className="text-sm text-gray-600 dark:text-zinc-400">
								Olay oluşturabilmek için öncelikle bir komponent eklemeniz
								gerekmektedir.
							</p>
							<Link
								href="/dashboard/components/create"
								className={buttonVariants({ variant: "outline" })}
							>
								<Plus size={16} className="mr-2" /> Yeni bir komponent oluştur
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
