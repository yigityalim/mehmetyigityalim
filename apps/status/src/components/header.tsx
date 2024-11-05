"use client";
import Image from "next/image";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { useForm, zodResolver } from "@myy/shared/form";
import { Button } from "@myy/ui/button";
import { Input } from "@myy/ui/input";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@myy/ui/form";
import { cn } from "@myy/ui/cn";

export function Header() {
	return (
		<div className="w-full pt-16 px-10 pb-6 flex flex-col md:flex-row gap-6 md:px-0 md:pb-12 items-center justify-center md:justify-between">
			<Link href="/">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 394 80"
					className="min-h-40 max-h-40 object-contain aspect-square"
				>
					<title>Next.js Logo</title>
					<path
						className="fill-dark dark:fill-white"
						d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"
					/>
					<path
						className="fill-dark dark:fill-white"
						d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"
					/>
				</svg>
			</Link>
			<Dialog />
		</div>
	);
}

const formSchema = z.object({
	email: z.string().email("E-posta adresi geçerli değil. Lütfen kontrol edin."),
});

function Dialog() {
	const [isOpen, setIsOpen] = React.useState(false);

	React.useEffect(() => {
		if (isOpen) {
			document.body.style.setProperty("overflow", "hidden");
		} else {
			document.body.style.removeProperty("overflow");
		}
	}, [isOpen]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	function onSubmit({ email }: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(email);
	}

	return (
		<>
			<Button type="button" onClick={() => setIsOpen(true)}>
				Abone Ol
			</Button>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 bg-black/80 p-6 flex items-center justify-center"
						onClick={() => setIsOpen(false)}
					>
						<motion.div
							className="bg-background w-full md:w-96 p-6 rounded-lg shadow-lg"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex justify-between items-center border-b pb-2 mb-8">
								<h2 className="text-2xl font-bold">Abone Ol</h2>
								<Button
									size="icon"
									variant="ghost"
									onClick={() => setIsOpen(false)}
								>
									<X size={24} />
								</Button>
							</div>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-8"
								>
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
																"border-red-500 text-white dark:border-red-900 bg-red-50 dark:bg-red-500 placeholder-opacity-100 focus-visible:ring-red-500 dark:focus-visible:ring-red-900",
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
									<Button type="submit">Submit</Button>
								</form>
							</Form>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
