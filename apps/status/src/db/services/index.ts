import { componentGroup as componentGroup } from "./component-group";
import { component as component } from "./component";
import { incident as incident } from "./incident";
import { incidentUpdate as incidentUpdate } from "./incident-update";
import { scheduledMaintenance as scheduledMaintenance } from "./scheduled-maintenance";
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
 *
 * @example
 * ```ts
 * import services from "./services";
 * const allIncidents = await services.incident.listIncidents(...);
 * ```
 *
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

export type * from "./scheduled-maintenance";
export type * from "./incident-update";
export type * from "./incident";
export type * from "./component-group";
export type * from "./component";
