import { signIn } from "@/auth";
import Form from "next/form";
import Link from "next/link";
import type React from "react";

export default function SignupPage() {
	return (
		<div>
			<h3>Register Page</h3>
			<Form
				action={async (formData) => {
					"use db";
					const email = formData.get("email") as string;
					const password = formData.get("password") as string;

					if (!email || !password) throw new Error("incorrect credentials");

					console.log("email", email);
					console.log("password", password);

					await signIn("credentials", { email, password });
				}}
			>
				<div>
					<label htmlFor="email">Email</label>
					<input type="email" name="email" required />
				</div>

				<div>
					<label htmlFor="password">Password</label>
					<input type="password" name="password" required />
				</div>
				<button type="submit">Create account</button>
			</Form>
			<div>
				Already have an account? <Link href="/auth/signin">Login here</Link>
			</div>
		</div>
	);
}
