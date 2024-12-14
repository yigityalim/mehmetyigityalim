import { componentGroupService as componentGroup } from "./component.group.service";
import { componentService as component } from "./component.service";
import { incidentService as incident } from "./incident.service";
import { incidentUpdateService as incidentUpdate } from "./incident.update.service";
import { scheduledMaintenanceService as scheduledMaintenance } from "./scheduled-maintenance.service";
import { utilsService } from "./utils";

/**
 * Incident service
 *
 * Tüm servislerin bir arada olduğu servisler objesi.
 *
 * @name services
 * @type {IncidentService}
 * @property {typeof component} component Component service
 * @property {typeof incident} incident Incident service
 * @property {typeof incidentUpdate} incidentUpdate Incident update service
 * @property {typeof scheduledMaintenance} scheduledMaintenance Scheduled maintenance service
 * @property {typeof utilsService} utils Utility service
 * @example
 * ```ts
 * import { services } from "./services";
 * const allIncidents = await services.incident.listIncidents(...);
 * ```
 *
 * @version 1.0.0
 */
export const services: IncidentService = {
	component,
	componentGroup,
	incident,
	incidentUpdate,
	scheduledMaintenance,
	utils: utilsService,
} satisfies IncidentService;

/**
 * Default export
 * @example
 * ```ts
 * import services from "./services";
 * const allIncidents = await services.incident.listIncidents(...);
 * ```
 */
export default services;

/* Type export */
export type IncidentService = {
	component: typeof component;
	componentGroup: typeof componentGroup;
	incident: typeof incident;
	incidentUpdate: typeof incidentUpdate;
	scheduledMaintenance: typeof scheduledMaintenance;
	utils: typeof utilsService;
};
export type IncidentUtils = typeof utilsService;

export type * from "./scheduled-maintenance.service";
export type * from "./incident.update.service";
export type * from "./incident.service";
export type * from "./component.group.service";
export type * from "./component.service";
