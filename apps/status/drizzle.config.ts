import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/server/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: "sqlite.db",
	},
});
