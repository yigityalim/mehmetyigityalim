import { FormItem } from "@/components/dashboard/form-item";
import { impactText } from "@/lib/utils";
import { impactEnum } from "@/server/schema";
import services from "@/server/services";
import { Button } from "@myy/ui/button";
import { Checkbox } from "@myy/ui/checkbox";
import { Input } from "@myy/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@myy/ui/select";
import Form from "next/form";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { z } from "zod";

const schema = z.object({
	name: z.string(),
	description: z.string(),
	status: z.string(),
	published: z.boolean(),
	group_id: z.string(),
	order: z.number(),
});

export default async function CreateComponentPage() {
	const allComponentGroups =
		await services.componentGroup.listComponentGroups();
	return (
		<div className="max-w-7xl mx-auto p-6 lg:p-12 overflow-y-hidden overflow-x-scroll">
			<div className="my-10 flex flex-col space-y-6 md:space-y-0 md:flex-row md:items-center md:justify-between">
				<div className="z-10">
					<h2 className="text-2xl leading-6 font-medium text-gray-900 dark:text-zinc-200">
						Yeni bir komponent oluştur
					</h2>
					<p className="mt-2 max-w-4xl text-sm text-zinc-700 dark:text-zinc-400">
						Mevcut proje için yeni bir komponent oluşturun. Bu, projenizdeki bir
						hizmet, sunucu veya uygulama olabilir.
					</p>
				</div>
				<div className="pt-14 w-full flex flex-col gap-2 items-center justify-start">
					{allComponentGroups.length > 0 ? (
						<Form
							action={async (formData) => {
								"use server";
								// mapping formData
								const data = {
									name: formData.get("component-name"),
									description: formData.get("component-description"),
									status: formData.get("component-status") ?? "operational",
									published: !!formData.get("component-published"),
									group_id: formData.get("component-group"),
									order: 1,
								};

								// validation
								const result = schema.safeParse(data);
								if (!result.success) {
									console.error(result.error);
									return;
								}

								// create component
								const response = await services.component.createComponent(
									result.data,
								);

								/** Mock response */
								//const response = { [hash]: 1 };

								if (response.id) {
									console.log("Komponent oluşturuldu");
									redirect("/dashboard/components");
								}
							}}
							className="w-full flex flex-col gap-6 items-center justify-start"
						>
							<h3 className="w-full text-start text-lg font-medium text-gray-900 dark:text-zinc-200 border-b border-gray-200 dark:border-zinc-200 pb-2">
								Komponent bilgileri
							</h3>
							<FormItem
								labelFor="component-name"
								label="Komponent Adı"
								description="Olayın kısa bir açıklaması"
							>
								<Input
									name="component-name"
									placeholder="Örn: Sunucu"
									id="component-name"
								/>
							</FormItem>
							<FormItem
								labelFor="component-description"
								label={
									<span>
										Komponent Açıklaması -
										<span className="font-bold italic text-xs ml-0.5">
											(Opsiyonel)
										</span>
									</span>
								}
								description="Komponentin detaylı bir açıklaması"
							>
								<Input
									id="component-description"
									name="component-description"
									placeholder="Örn: Sunucu kesintisi yaşandı ve bu süre zarfında kullanıcılarımız hizmet alamadı."
								/>
							</FormItem>
							<FormItem
								labelFor="component-status"
								label={
									<span>
										Komponent Durumu -
										<span className="font-bold italic text-xs ml-0.5">
											(Opsiyonel)
										</span>
									</span>
								}
								description={
									<>
										Komponentin durumu. Örn: Bilinmeyen, Kısmi kesinti, Tam
										kesinti, Bakım. Eğer seçmez iseniz durum otomatik olarak{" "}
										<span className="text-black dark:text-white font-bold">
											Bilinmeyen
										</span>{" "}
										olarak ayarlanacaktır.
									</>
								}
							>
								<Select name="component-status">
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Durum seçin" />
									</SelectTrigger>
									<SelectContent>
										{impactEnum.map((status) => (
											<SelectItem
												value={status}
												key={status}
												className="capitalize"
											>
												{impactText[status]}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormItem>
							<FormItem
								labelFor="component-order"
								label="Komponent önceliği"
								description="Komponentin önceliği. Eğer seçmez iseniz bu komponent durum sayfanızda en sona eklenir."
							>
								<Input
									type="number"
									name="component-order"
									placeholder="Örn: 1"
									id="component-order"
								/>
							</FormItem>
							<FormItem
								labelFor="component-published"
								label="Yayınlansın mı?"
								description="Komponentin yayınlanma tarihi. Eğer seçmez iseniz bu komponent durum sayfanızda yayınlanmayacaktır."
								className="flex-row items-center"
							>
								<Checkbox name="component-published" id="component-published" />
								<span className="ml-2">Evet, yayınlansın</span>
							</FormItem>
							<FormItem
								labelFor="component-group"
								label="Komponent Grubu"
								description="Komponentin hangi gruba ait olduğunu seçin."
							>
								<Select name="component-group">
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Grup seçin" />
									</SelectTrigger>
									<SelectContent>
										{allComponentGroups.map((group) => (
											<SelectItem value={group.id} key={group.id}>
												{group.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormItem>
							<Button type="submit" className="w-full mt-10">
								Komponent oluştur
							</Button>
						</Form>
					) : (
						<div className="text-center w-full">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Komponent grupları bulunamadı. Lütfen{" "}
								<Link
									href="/dashboard/components/groups/create"
									className="text-blue-500 dark:text-blue-400 underline"
								>
									bir komponent grubu oluşturun
								</Link>{" "}
								veya var olan bir komponent grubunu seçin.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
