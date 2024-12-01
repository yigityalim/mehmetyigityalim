import baseConfig from "@myy/ui/tailwind.config";
import type { Config } from "tailwindcss";
import defaultColors from "tailwindcss/colors";

export default {
	content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
	presets: [baseConfig],
	theme: {
		container: {
			center: true,
		},
		colors: {
			...defaultColors,
			text: "var(--color-text)",
			neutral: {
				20: "#F9FAFB",
				30: "#F8F9FC",
				40: "#F4F5F8",
				50: "#EAECF1",
				60: "#EEEFF2",
				70: "#DFE3EA",
				80: "#D5D9E3",
				90: "#C6CCDB",
				100: "#B8BFD1",
				200: "#939DB8",
				300: "#646E87",
				400: "#4E576E",
				500: "#3B4254",
				600: "#2F3647",
				700: "#293040",
				800: "#222838",
				850: "#1F2433",
				900: "#121826",
			},
			"statuspage-neutral": {
				40: "#F5F5F7",
				60: "#EEEFF2",
				80: "#E2E4E9",
				200: "#8A91A5",
				600: "#2D313C",
				700: "#21242D",
				800: "#191C24",
				900: "#0F121A",
			},
		},
	},
} satisfies Config;
