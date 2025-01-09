import { Button } from "@myy/ui/button";
import Form from "next/form";
import {seed} from "@/db/seed";
import {redirect} from "next/navigation";

export default async function Test() {
	return (
		<Form
			className="w-full min-h-dvh flex flex-col items-center justify-center gap-4"
			action={async () => {
			"use server";
			await seed().finally(console.log);
		}}>
			<h1 className="text-2xl">Test</h1>
			<Button type="submit">Submit</Button>
		</Form>
	);
}
