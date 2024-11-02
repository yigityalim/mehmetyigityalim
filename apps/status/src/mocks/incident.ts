type IncidentStatus = "open" | "resolved" | "closed";
type IncidentPriority = "low" | "medium" | "high";
type IncidentType = "incident" | "alert" | "issue" | "event";
type EventStatus =
	| "created"
	| "updated"
	| "resolved"
	| "closed"
	| "investigating";
export type DateTime = Date | string | number;

export interface Incident {
	id: number;
	title: string;
	status: IncidentStatus;
	created_at: DateTime;
	updated_at: DateTime;
	type: IncidentType;
	priority: IncidentPriority;
	assignee: string;
	resolved_at: string | null;
	tags: string[];
	events: IncidentEvent[];
}

export interface IncidentEvent {
	id: number;
	incident_id: number;
	title: string;
	message: string;
	status: EventStatus;
	created_at: DateTime;
	updated_at: DateTime;
}

export const mockIncidents = [
	{
		id: 1,
		title: "mehmetyigityalim.com spotify api",
		status: "open",
		created_at: "2024-07-12T00:00:00Z",
		updated_at: "2021-01-01T00:00:00Z",
		type: "incident",
		priority: "low",
		assignee: "John Doe",
		resolved_at: null,
		tags: ["tag1", "tag2"],
		events: [
			{
				id: 1.1,
				incident_id: 1,
				title: "Resolved",
				message: "This incident has been resolved.",
				status: "resolved",
				created_at: "2021-01-01T00:00:00Z",
				updated_at: "2021-01-01T00:00:00Z",
			},
			{
				id: 1.2,
				incident_id: 1,
				title: "Update",
				message:
					"API response süresi planlanan süreden fazla olduğu için API'yi güncelliyoruz.",
				status: "updated",
				created_at: "2021-01-01T00:00:00Z",
				updated_at: "2021-01-01T00:00:00Z",
			},
			{
				id: 1.3,
				incident_id: 1,
				title: "Investigating",
				message: "We are currently investigating this issue.",
				status: "investigating",
				created_at: "2021-01-01T00:00:00Z",
				updated_at: "2021-01-01T00:00:00Z",
			},
		],
	},
	{
		id: 1.4,
		title: "mehmetyigityalim.com site bakımı",
		status: "open",
		created_at: "2024-07-10T00:00:00Z",
		updated_at: "2021-01-01T00:00:00Z",
		type: "incident",
		priority: "low",
		assignee: "John Doe",
		resolved_at: null,
		tags: ["tag1", "tag2"],
		events: [
			{
				id: 1.5,
				incident_id: 1,
				title: "Resolved",
				message: "This incident has been resolved.",
				status: "resolved",
				created_at: "2021-01-01T00:00:00Z",
				updated_at: "2021-01-01T00:00:00Z",
			},
			{
				id: 1.6,
				incident_id: 1,
				title: "Update",
				message: "Tasarımsal düzenlemeler yapıldı.",
				status: "updated",
				created_at: "2021-01-01T00:00:00Z",
				updated_at: "2021-01-01T00:00:00Z",
			},
			{
				id: 1.7,
				incident_id: 1,
				title: "Investigating",
				message: "We are currently investigating this issue.",
				status: "investigating",
				created_at: "2021-01-01T00:00:00Z",
				updated_at: "2021-01-01T00:00:00Z",
			},
		],
	},
	{
		id: 2,
		title: "api.mehmetyigityalim.com bakımı",
		status: "open",
		created_at: "2024-07-17T00:00:00Z",
		updated_at: "2021-01-01T00:00:00Z",
		type: "incident",
		priority: "low",
		assignee: "John Doe",
		resolved_at: null,
		tags: ["tag1", "tag2"],
		events: [
			{
				id: 2.1,
				incident_id: 1,
				title: "Resolved",
				message: "This incident has been resolved.",
				status: "resolved",
				created_at: "2021-01-01T00:00:00Z",
				updated_at: "2021-01-01T00:00:00Z",
			},
			{
				id: 2.2,
				incident_id: 1,
				title: "Update",
				message: "API'ye yeni özellikler eklendi.",
				status: "updated",
				created_at: "2021-01-01T00:00:00Z",
				updated_at: "2021-01-01T00:00:00Z",
			},
			{
				id: 2.3,
				incident_id: 1,
				title: "Investigating",
				message: "We are currently investigating this issue.",
				status: "investigating",
				created_at: "2021-01-01T00:00:00Z",
				updated_at: "2021-01-01T00:00:00Z",
			},
			{
				id: 2.4,
				incident_id: 1,
				title: "Update",
				message: "API'ye yeni özellikler eklendi.",
				status: "updated",
				created_at: "2021-01-01T00:00:00Z",
				updated_at: "2021-01-01T00:00:00Z",
			},
			{
				id: 2.5,
				incident_id: 1,
				title: "Update",
				message: "API'ye yeni özellikler eklendi.",
				status: "updated",
				created_at: "2021-01-01T00:00:00Z",
				updated_at: "2021-01-01T00:00:00Z",
			},
			{
				id: 2.6,
				incident_id: 1,
				title: "Update",
				message: "API'ye yeni özellikler eklendi.",
				status: "updated",
				created_at: "2021-01-01T00:00:00Z",
				updated_at: "2021-01-01T00:00:00Z",
			},
		],
	},
] satisfies Incident[];
