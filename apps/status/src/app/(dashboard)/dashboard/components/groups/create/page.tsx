import { FormItem } from "@/components/dashboard/form-item";
import services from "@/server/services";
import { Button } from "@myy/ui/button";
import { Checkbox } from "@myy/ui/checkbox";
import { Input } from "@myy/ui/input";
import Form from "next/form";
import { redirect } from "next/navigation";
import React from "react";
import { z } from "zod";

const schema = z.object({
	name: z.string(),
	published: z.boolean(),
	order: z.number(),
});

export default async function CreateComponentGroupPage() {
	return (
		<div className="max-w-7xl mx-auto p-6 lg:p-12 overflow-y-hidden overflow-x-scroll">
			<div className="my-10 flex flex-col space-y-6 md:space-y-0 md:flex-row md:items-center md:justify-between">
				<div className="z-10">
					<h2 className="text-2xl leading-6 font-medium text-gray-900 dark:text-zinc-200">
						Yeni bir komponent grubu oluştur
					</h2>
					<p className="mt-2 max-w-4xl text-sm text-zinc-700 dark:text-zinc-400">
						Mevcut proje için yeni bir komponent grubu oluşturun. Bu,
						projenizdeki bir hizmet, sunucu veya uygulama grubu olabilir.
						Uygulamaları gruplama için bunu zorunlu kılıyoruz.
					</p>
				</div>
				<div className="pt-14 w-full flex flex-col gap-2 items-center justify-start">
					<Form
						action={async (formData) => {
							"use server";
							// mapping formData
							const data = {
								name: formData.get("component-group-name"),
								published: formData.get("component-group-published") === "on",
								order: Number(formData.get("component-group-order")),
							};

							// validate data
							const validatedData = schema.safeParse(data);

							if (validatedData.error || !validatedData.data) {
								console.log(validatedData.error);
								return;
							}

							// send data to server

							const response =
								await services.componentGroup.createComponentGroup(
									validatedData.data,
								);

							/*const response = {
								[hash]: "123",
							};*/

							if (response.id) {
								console.log("Component group created successfully");
								redirect("/dashboard/components/groups");
							}
						}}
						className="w-full flex flex-col gap-6 items-center justify-start"
					>
						<h3 className="w-full text-start text-lg font-medium text-gray-900 dark:text-zinc-200 border-b border-gray-200 dark:border-zinc-200 pb-2">
							Komponent grubu bilgileri
						</h3>
						<FormItem
							labelFor="component-group-name"
							label="Komponent Grubu Adı"
							description="Grubun kısa bir açıklaması"
						>
							<Input
								name="component-group-name"
								placeholder="Örn: Sunucular"
								id="component-group-name"
							/>
						</FormItem>
						<FormItem
							labelFor="component-group-published"
							label="Yayınlansın mı?"
							description="Komponentin yayınlanma tarihi. Eğer seçmez iseniz bu komponent durum sayfanızda yayınlanmayacaktır."
							className="flex-row items-center"
						>
							<Checkbox
								name="component-group-published"
								id="component-group-published"
							/>
							<span className="ml-2">Evet, yayınlansın</span>
						</FormItem>
						<FormItem
							labelFor="component-group-order"
							label="Sıra"
							description="Komponentin sırası. Eğer seçmez iseniz bu komponent durum sayfanızda en sona eklenir."
						>
							<Input
								type="number"
								name="component-group-order"
								placeholder="Örn: 1"
								id="component-order"
							/>
						</FormItem>
						<Button type="submit" className="w-full">
							Komponent oluştur
						</Button>
					</Form>
				</div>
			</div>
		</div>
	);
}
