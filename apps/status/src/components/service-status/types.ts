import type { IncidentSelect } from "@/db/schema";

export type DailyStatus = {
	date: Date;
	events: Required<IncidentSelect[]>;
};
