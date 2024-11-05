import { incidentService } from "@/server/services/incident";
import { Button } from "@myy/ui/button";
import { Input } from "@myy/ui/input";
import { Label } from "@myy/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@myy/ui/select";
import Form from "next/form";
import { redirect } from "next/navigation";
import { z } from "zod";

const status = [
	"open",
	"created",
	"updated",
	"update",
	"resolved",
	"closed",
	"investigating",
] as const;

const incidentValidation = z.object({
	title: z.string(),
	status: z.enum(status),
	site_id: z.number(),
	type: z.enum(["low", "medium", "high"]),
	priority: z.enum(["low", "medium", "high"]),
	assignee: z.string(),
	event_title: z.string(),
	event_status: z.enum(status),
	event_message: z.string(),
});

export default function CreateIncidentPage() {
	return (
		<div className="w-full flex flex-col gap-4 items-center justify-center">
			<Form
				action={async (formData) => {
					"use server";

					const validatedData = incidentValidation.safeParse({
						title: formData.get("title"),
						status: formData.get("status"),
						site_id: Number(formData.get("site_id")),
						type: formData.get("type"),
						priority: formData.get("priority"),
						assignee: formData.get("assignee"),
						event_title: formData.get("event_title"),
						event_status: formData.get("event_status"),
						event_message: formData.get("event_message"),
					});
					if (!validatedData.success) {
						console.error("ERROR FORM DATA", validatedData.data);
						return;
					}

					const {
						title,
						status,
						site_id,
						type,
						priority,
						assignee,
						event_title,
						event_status,
						event_message,
					} = validatedData.data;

					const response = await incidentService.createIncidentWithEvents({
						title,
						status,
						site_id,
						type,
						priority,
						assignee,
						events: [
							{
								title: event_title,
								status: event_status,
								message: event_message,
							},
						],
					});

					// toast
					redirect("/");
				}}
				className="w-full flex flex-col gap-6 items-center justify-start *:w-full"
			>
				<Label>
					<p className="mb-2 font-medium">Olayın ismi:</p>
					<Input name="title" placeholder="Olayın ismi" />
				</Label>
				<Select name="status" defaultValue="open">
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Durum" />
					</SelectTrigger>
					<SelectContent>
						{status.map((s) => (
							<SelectItem key={s} className="capitalize" value={s}>
								{s}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Label>
					<p className="mb-2 font-medium">Site ID:</p>
					<Input name="site_id" placeholder="Site ID" />
				</Label>
				<Label>
					<p className="mb-2 font-medium">Olay tipi:</p>
					<Input name="type" placeholder="Olay tipi" />
				</Label>
				<Label>
					<p className="mb-2 font-medium">Öncelik:</p>
					<Input name="priority" placeholder="Öncelik" />
				</Label>
				<Label>
					<p className="mb-2 font-medium">Atanan:</p>
					<Input name="assignee" placeholder="Atanan" />
				</Label>
				<Label>
					<p className="mb-2 font-medium">Olay başlığı:</p>
					<Input name="event_title" placeholder="Olay başlığı" />
				</Label>

				<Select name="event_status" defaultValue="open">
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Durum" />
					</SelectTrigger>
					<SelectContent>
						{status.map((s) => (
							<SelectItem key={s} className="capitalize" value={s}>
								{s}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Label>
					<p className="mb-2 font-medium">Olay mesajı:</p>
					<Input name="event_message" placeholder="Olay mesajı" />
				</Label>
				<Button type="submit" className="w-full">
					Gönder
				</Button>
			</Form>
		</div>
	);
}
