import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export default function SignIn() {
	return (
		<form
			action={async (formData) => {
				"use server";
				try {
					await signIn("credentials", formData);
				} catch (error) {
					if (error instanceof AuthError) console.log("AuthError", error);
					else {
						console.error(error);
					}
				}
			}}
		>
			<label>
				Email
				<input name="email" type="email" />
			</label>
			<label>
				Password
				<input name="password" type="password" />
			</label>
			<button type={"submit"}>Sign In</button>
		</form>
	);
}
