import type { IncidentSelect } from "@/server/schema";

export type DailyStatus = {
	date: Date;
	events: Required<IncidentSelect[]>;
};
