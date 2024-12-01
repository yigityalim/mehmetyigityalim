import { cyan, red, green, yellow } from "kleur";

export const logger = {
	info: (message: string) => console.log(cyan().bold(
		message
	)),
	error: <T extends string>(message: T) => console.log(red().bold(message)),
	success: <T extends string>(message: T) => console.log(green().bold(message)),
	warning: <T extends string>(message: T) =>
		console.log(yellow().bold(message)),
};
