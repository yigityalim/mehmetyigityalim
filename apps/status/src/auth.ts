import { addUserToDb, getUserFromDb, passwordToSalt } from "@/server/auth";
import { db, type users } from "@/server/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { compare } from "bcrypt-ts";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { object, string } from "zod";

export const signInSchema = object({
	email: string({ required_error: "Email is required" })
		.min(1, "Email is required")
		.email("Invalid email"),
	password: string({ required_error: "Password is required" })
		.min(1, "Password is required")
		.min(8, "Password must be more than 8 characters")
		.max(32, "Password must be less than 32 characters"),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: DrizzleAdapter(db),
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email", placeholder: "jsmith" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				let user: typeof users.$inferSelect | undefined;
				const email = credentials.email as string;
				const password = credentials.password as string;

				if (!email || !password) {
					return null;
				}

				user = await getUserFromDb(email);

				if (user) {
					if (!user.password) {
						return null;
					}

					const isAuthenciated = await compare(password, user.password);
					if (isAuthenciated) {
						return user;
					}
					return null;
				}

				if (!user) {
					const saltedPassword = passwordToSalt(password);
					user = await addUserToDb(email, saltedPassword);
				}

				if (!user) {
					throw new Error("User was not found and could not be created.");
				}

				return user;
			},
		}),
	],
	debug: process.env.NODE_ENV === "development",
	session: { strategy: "jwt" },
	secret: process.env.AUTH_SECRET,
});
