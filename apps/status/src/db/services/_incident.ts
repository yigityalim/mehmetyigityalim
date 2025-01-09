/**
 * @fileoverview Incident service
 * @deprecated This file will be removed in the next version
 * @version 1.0.0
 * @license GNU AFFERO GENERAL PUBLIC LICENSE Version 3
 */

import { db } from "../db";
import {
  component,
  componentGroup,
  incident,
  incidentUpdate,
  scheduledMaintenance,
  incidentImpact,
  type ComponentInsert,
  type ComponentGroupInsert,
  type IncidentInsert,
  type IncidentUpdateInsert,
  type ScheduledMaintenanceInsert,
} from "../schema";
import { eq, desc, or, and, gte, lte, asc, inArray, sql } from "drizzle-orm";
import { _ } from "@myy/shared";

export type MaybePromise<T> = Promise<T | undefined>;

/**
 * @deprecated This type will be removed in the next version
 */
export interface IIncidentService {
  // Component Methods
  createComponent(
    data: Omit<ComponentInsert, "id">,
  ): MaybePromise<ComponentInsert>;
  getComponentById(id: string): MaybePromise<ComponentInsert | null>;
  getComponentByName(name: string): MaybePromise<ComponentInsert | null>;
  updateComponent(
    id: string,
    data: Partial<ComponentInsert>,
  ): MaybePromise<ComponentInsert>;
  deleteComponent(id: string): Promise<void>;
  listComponents(): MaybePromise<ComponentInsert[]>;

  // Component Group Methods
  createComponentGroup(
    data: Omit<ComponentGroupInsert, "id">,
  ): MaybePromise<ComponentGroupInsert>;
  getComponentGroupById(id: string): MaybePromise<ComponentGroupInsert | null>;
  getComponentGroupByName(
    name: string,
  ): MaybePromise<ComponentGroupInsert | null>;
  updateComponentGroup(
    id: string,
    data: Partial<ComponentGroupInsert>,
  ): MaybePromise<ComponentGroupInsert>;
  deleteComponentGroup(id: string): Promise<void>;
  listComponentGroups(): MaybePromise<ComponentGroupInsert[]>;
  addComponentToGroup(groupId: string, componentId: string): MaybePromise<void>;

  // Incident Methods
  createIncidentWithImpacts(
    data: Omit<IncidentInsert, "id">,
    componentIds: string[],
  ): MaybePromise<IncidentInsert> | { error: string };
  getIncidentById(id: string): MaybePromise<IncidentInsert | null>;
  getLastIncident(componentId: string): MaybePromise<IncidentInsert | null>;
  listIncidents(): MaybePromise<IncidentInsert[]>;
  updateIncident(
    id: string,
    data: Partial<IncidentInsert>,
  ): MaybePromise<IncidentInsert>;
  deleteIncident(id: string): Promise<void>;
  getIncidentHistory(
    componentId: string,
    from: Date,
    to: Date,
  ): MaybePromise<IncidentInsert[]>;

  // Incident Update Methods
  addIncidentUpdateToIncident(
    data: Omit<IncidentUpdateInsert, "id" | "incident_id">,
    incidentId: string,
  ): MaybePromise<IncidentUpdateInsert>;
  getIncidentUpdateById(id: string): MaybePromise<IncidentUpdateInsert | null>;
  updateIncidentUpdate(
    id: string,
    data: Partial<IncidentUpdateInsert>,
  ): MaybePromise<IncidentUpdateInsert>;
  listIncidentUpdates(): MaybePromise<IncidentUpdateInsert[]>;

  // Scheduled Maintenance Methods
  createScheduledMaintenance(
    data: Omit<ScheduledMaintenanceInsert, "id">,
  ): MaybePromise<ScheduledMaintenanceInsert>;
  createScheduledMaintenanceWithComponents(
    data: Omit<ScheduledMaintenanceInsert, "id">,
    componentIds: string[],
  ): MaybePromise<ScheduledMaintenanceInsert>;

  // Utility Methods
  getComponentStatus(): MaybePromise<ComponentInsert[]>;
  getActiveIncidents(): MaybePromise<IncidentInsert[]>;
  getSystemStatus(): Promise<{
    overallStatus: string;
    components: ComponentInsert[];
    activeIncidents: IncidentInsert[];
  }>;
  getUptime(componentId: string, days: number): MaybePromise<number>;
}

/**
 * Hata yakalama işlevi ile bir işlevi sarmalar
 * @template T
 * @param {() => T | Promise<T>} fn İşlev veya işlevin dönüşü. Promise dönen işlevler için de kullanılabilir.
 * @returns {T | Promise<T> | undefined} İşlevin dönüş değeri veya undefined
 * @example
 * const result = withErrorHandling(() => someFunction());
 * if (result) {
 *  // do something with result
 * }
 *
 * @example
 * const obj = await withErrorHandling(async () => [
 *  await someAsyncFunction(),
 *  await anotherAsyncFunction(),
 * ])
 *
 * @example
 *
 * const result = await withErrorHandling(async () => await someAsyncFunction());
 * if (result) {
 * // do something with result
 * }
 */
export function withErrorHandling<T>(
  fn: () => T | Promise<T>,
  { logError = true }: { logError?: boolean } = {},
): T | Promise<T | undefined> | undefined {
  try {
    const result = fn();

    if (result instanceof Promise) {
      return result.catch((error) => {
        if (logError) {
          console.error("Async error:", error);
        }
        return undefined;
      });
    }

    return result;
  } catch (error) {
    if (logError) {
      console.error("Sync error:", error);
    }
    return undefined;
  }
}

/**
 * @deprecated This class will be removed in the next version
 */
class IncidentService implements IIncidentService {
  // Component Methods
  async createComponent(data: Omit<ComponentInsert, "id">) {
    return withErrorHandling(async () => {
      const [insertedComponent] = await db
        .insert(component)
        .values({
          ...data,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();
      return insertedComponent;
    });
  }

  async getComponentById(id: string) {
    return withErrorHandling(async () =>
      db.query.component.findFirst({
        where: eq(component.id, id),
        with: {
          group: true,
          incidentImpacts: true,
        },
      }),
    );
  }

  async getComponentByName(name: string) {
    return withErrorHandling(async () =>
      db.query.component.findFirst({
        where: eq(component.name, name),
        with: {
          group: true,
          incidentImpacts: true,
        },
      }),
    );
  }

  async updateComponent(id: string, data: Partial<ComponentInsert>) {
    return withErrorHandling(async () => {
      const [updatedComponent] = await db
        .update(component)
        .set({ ...data, updated_at: new Date() })
        .where(eq(component.id, id))
        .returning();
      return updatedComponent;
    });
  }

  async deleteComponent(id: string) {
    withErrorHandling(
      async () => await db.delete(component).where(eq(component.id, id)),
    );
  }

  async listComponents() {
    return withErrorHandling(() =>
      db.query.component.findMany({
        with: {
          group: true,
        },
        orderBy: [asc(component.order)],
      }),
    );
  }

  // Component Group Methods
  // TODO: add withErrorHandling to all methods
  async createComponentGroup(data: Omit<ComponentGroupInsert, "id">) {
    const [insertedGroup] = await db
      .insert(componentGroup)
      .values({ ...data, created_at: new Date(), updated_at: new Date() })
      .returning();
    return insertedGroup;
  }

  async getComponentGroupById(id: string) {
    return db.query.componentGroup.findFirst({
      where: eq(componentGroup.id, id),
      with: {
        components: true,
      },
    });
  }

  async getComponentGroupByName(name: string) {
    return db.query.componentGroup.findFirst({
      where: eq(componentGroup.name, name),
      with: {
        components: true,
      },
    });
  }

  async updateComponentGroup(id: string, data: Partial<ComponentGroupInsert>) {
    const [updatedGroup] = await db
      .update(componentGroup)
      .set({ ...data, updated_at: new Date() })
      .where(eq(componentGroup.id, id))
      .returning();
    return updatedGroup;
  }

  async deleteComponentGroup(id: string) {
    await db.delete(componentGroup).where(eq(componentGroup.id, id));
  }

  async listComponentGroups() {
    return db.query.componentGroup.findMany({
      with: {
        components: true,
      },
      orderBy: [asc(componentGroup.order)],
    });
  }

  async addComponentToGroup(groupId: string, componentId: string) {
    return db.transaction(async (tx) => {
      const group = await tx.query.componentGroup.findFirst({
        where: eq(componentGroup.id, groupId),
        with: {
          components: true,
        },
      });

      if (!group) {
        return;
      }

      await tx
        .update(component)
        .set({ group_id: groupId })
        .where(eq(component.id, componentId));
    });
  }

  // Incident Methods
  async createIncidentWithImpacts(
    data: Omit<IncidentInsert, "id"> & { message: string },
    componentIds: string[],
  ) {
    if (componentIds.length === 0) {
      throw { error: "At least one component must be impacted" };
    }

    const incidentData = _.omit(data, "message");

    return db.transaction(async (tx) => {
      const [insertedIncident] = await tx
        .insert(incident)
        .values({
          ...incidentData,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      if (componentIds.length > 0 && insertedIncident) {
        // ilk güncellemeyi ekle. bu, olayın başlangıcıdır.
        await tx.insert(incidentUpdate).values({
          incident_id: insertedIncident.id,
          status: "detected", // durum: tespit edildi
          title: data.title, // olayın başlangıcı aynı şekilde güncellemenin de başlığı olacak.
          content: data.message,
        });

        // etkilenen bileşenleri ekle
        await tx.insert(incidentImpact).values(
          componentIds.map((componentId) => ({
            incident_id: insertedIncident.id,
            component_id: componentId,
            created_at: new Date(),
          })),
        );
      }

      await Promise.all(
        componentIds.map(async (componentId) => {
          const [updatedComponent] = await tx
            .update(component)
            .set({ status: data.impact })
            .where(eq(component.id, componentId))
            .returning();
          return updatedComponent;
        }),
      );

      return insertedIncident;
    });
  }

  async getLastIncident() {
    return await db.transaction(async (tx) => {
      const lastIncident = await tx.query.incident.findFirst({
        orderBy: [desc(incident.created_at)],
        with: {
          updates: true,
          impactedComponents: {
            with: {
              component: true,
            },
          },
        },
      });

      return lastIncident;
    });
  }

  async listIncidents() {
    const incidents = db.query.incident.findMany({
      with: {
        updates: true,
        impactedComponents: {
          with: {
            component: true,
          },
        },
      },
      orderBy: [desc(incident.created_at)],
    });

    return incidents ?? [];
  }

  async getIncidentById(id: string) {
    return db.query.incident.findFirst({
      where: eq(incident.id, id),
      with: {
        updates: true,
        impactedComponents: {
          with: {
            component: true,
          },
        },
      },
    });
  }

  async updateIncident(id: string, data: Partial<IncidentInsert>) {
    const [updatedIncident] = await db
      .update(incident)
      .set({ ...data, updated_at: new Date() })
      .where(eq(incident.id, id))
      .returning();
    return updatedIncident;
  }

  async deleteIncident(id: string) {
    await db.delete(incident).where(eq(incident.id, id));
  }

  async getIncidentHistory(componentId: string, from: Date, to: Date) {
    return db.transaction(async (tx) => {
      const incidentImpactId = tx
        .select({ id: incidentImpact.incident_id })
        .from(incidentImpact)
        .where(eq(incidentImpact.component_id, componentId));

      // FIXME: check this
      if ((await incidentImpactId).length === 0) {
        return [];
      }

      return tx.query.incident.findMany({
        where: and(
          gte(incident.created_at, from),
          lte(incident.created_at, to),
          inArray(incident.id, incidentImpactId),
        ),
        with: {
          updates: true,
          impactedComponents: {
            with: {
              component: true,
            },
          },
        },
        orderBy: [desc(incident.created_at)],
      });
    });
  }

  // Incident Update Methods
  async addIncidentUpdateToIncident(
    data: Omit<IncidentUpdateInsert, "id" | "incident_id">,
    incidentId: string,
  ) {
    return db.transaction(async (tx) => {
      const [insertedUpdate] = await tx
        .insert(incidentUpdate)
        .values({
          ...data,
          incident_id: incidentId,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      await tx
        .update(incident)
        .set({ status: data.status, updated_at: new Date() })
        .where(eq(incident.id, incidentId));

      return insertedUpdate;
    });
  }

  async getIncidentUpdateById(id: string) {
    return db.query.incidentUpdate.findFirst({
      where: eq(incidentUpdate.id, id),
    });
  }

  async updateIncidentUpdate(id: string, data: Partial<IncidentUpdateInsert>) {
    const [updatedUpdate] = await db
      .update(incidentUpdate)
      .set({ ...data, updated_at: new Date() })
      .where(eq(incidentUpdate.id, id))
      .returning();
    return updatedUpdate;
  }

  async listIncidentUpdates() {
    return db.query.incidentUpdate.findMany({
      orderBy: [desc(incidentUpdate.created_at)],
    });
  }

  // Scheduled Maintenance Methods
  async createScheduledMaintenance(
    data: Omit<ScheduledMaintenanceInsert, "id">,
  ) {
    const [insertedMaintenance] = await db
      .insert(scheduledMaintenance)
      .values({ ...data, created_at: new Date(), updated_at: new Date() })
      .returning();
    return insertedMaintenance;
  }

  // Note: There's no maintenanceComponent table in the provided schema
  // If you need to associate components with scheduled maintenance, you might want to add this table
  // For now, we'll skip the component association part
  async createScheduledMaintenanceWithComponents(
    data: Omit<ScheduledMaintenanceInsert, "id">,
    componentIds: string[],
  ) {
    const [insertedMaintenance] = await db
      .insert(scheduledMaintenance)
      .values({ ...data, created_at: new Date(), updated_at: new Date() })
      .returning();

    // TODO: If you add a maintenanceComponent table, you can associate components here

    return insertedMaintenance;
  }

  // Utility Methods
  async getComponentStatus() {
    return db.query.component.findMany({
      orderBy: [asc(component.order)],
      with: {
        group: true,
      },
    });
  }

  async getActiveIncidents() {
    return db.query.incident.findMany({
      where: or(
        eq(incident.status, "investigating"),
        eq(incident.status, "identified"),
        eq(incident.status, "monitoring"),
      ),
      with: {
        updates: true,
        impactedComponents: {
          with: {
            component: true,
          },
        },
      },
      orderBy: [desc(incident.created_at)],
    });
  }

  async getSystemStatus() {
    const [components, activeIncidents] = await Promise.all([
      this.getComponentStatus(),
      this.getActiveIncidents(),
    ]);

    let overallStatus = "operational";
    for (const component of components) {
      if (component.status === "major_outage") {
        overallStatus = "major_outage";
        break;
      }
      if (
        component.status === "partial_outage" &&
        overallStatus !== "major_outage"
      ) {
        overallStatus = "partial_outage";
      } else if (
        component.status === "degraded_performance" &&
        overallStatus === "operational"
      ) {
        overallStatus = "degraded_performance";
      }
    }

    return {
      overallStatus,
      components,
      activeIncidents,
    };
  }

  async getUptime(componentId: string, days: number) {
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const incidents = await this.getIncidentHistory(
      componentId,
      startDate,
      now,
    );

    let downtime = 0;
    for (const incident of incidents) {
      const start = new Date(incident.started_at);
      const end = incident.resolved_at ? new Date(incident.resolved_at) : now;
      downtime += end.getTime() - start.getTime();
    }

    const totalTime = now.getTime() - startDate.getTime();
    const uptime = (totalTime - downtime) / totalTime;

    return uptime;
  }
}

/**
 * @deprecated This instance will be removed in the next version
 */
export const incidentService = new IncidentService();

// Types
/**
 * @deprecated This type will be removed in the next version
 */
export type IncidentServiceType = InstanceType<typeof IncidentService>;

/**
 * @deprecated This type will be removed in the next version
 */
export type IncidentServiceFunctionReturnType<
  F extends keyof IncidentServiceType,
> = Awaited<ReturnType<IncidentServiceType[F]>>;

/**
 * @deprecated This type will be removed in the next version
 */
export type IncidentServiceFunctionParams<F extends keyof IncidentServiceType> =
  Parameters<IncidentServiceType[F]>;

/**
 * @deprecated This type will be removed in the next version
 */
export type IncidentServiceFunction<F extends keyof IncidentServiceType> = (
  ...args: IncidentServiceFunctionParams<F>
) => IncidentServiceFunctionReturnType<F>;
