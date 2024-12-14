import { db, users } from "@/server/db";
import { hashSync } from "bcrypt-ts";
import { eq } from "drizzle-orm";

export function passwordToSalt(password: string) {
	const saltRounds = 10;
	return hashSync(password, saltRounds);
}

export async function getUserFromDb(email: string) {
	const user = await db.query.users.findFirst({
		where: eq(users.email, email),
	});
	return user;
}

export async function addUserToDb(email: string, saltedPassword: string) {
	const user = await db
		.insert(users)
		.values({
			id: crypto.randomUUID(),
			email: email,
			password: saltedPassword,
		})
		.returning();
	return user.pop();
}
