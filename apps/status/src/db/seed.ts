import "server-only";
import { services as servicesInstance } from './services';
import {addDays} from "@myy/shared/date";

export async function seed() {
    const isDatabaseEmpty = servicesInstance.utils.isDatabaseEmpty();

    if (!isDatabaseEmpty) {
        console.log("Database is not empty. Skipping seeding...");
        return;
    }

    console.log("Seeding database...");
    const start = performance.now();

    // Component Groups
    const [
        sites,
        services,
        apis,
    ] = await Promise.all([
        await servicesInstance.componentGroup.createComponentGroup({ name: "Siteler", order: 1, published: true }),
        await servicesInstance.componentGroup.createComponentGroup({ name: "Hizmetler", order: 2, published: true }),
        await servicesInstance.componentGroup.createComponentGroup({ name: "API'lar", order: 3, published: true }),
    ]);

    if (!sites || !services || !apis) {
        console.error("Failed to create Component Groups.");
        return;
    }

    console.log(`
        Component Groups:
        - Sites: ${sites.id}
        - Services: ${services.id}
        - APIs: ${apis.id}
    `)

    // Adding Components to created Component Groups

    // Sites
    try {
        await Promise.all([
            await servicesInstance.component.createComponent({ name: "mehmetyigityalim.com", description: "Kişisel blog", published: true, order: 1, group_id: sites.id}),
            await servicesInstance.component.createComponent({ name: "status.mehmetyigityalim.com", description: "Durum takibi.", published: true, order: 2, group_id: sites.id}),
            await servicesInstance.component.createComponent({ name: "api.mehmetyigityalim.com", description: "API", published: true, order: 3, group_id: apis.id}),
            await servicesInstance.component.createComponent({ name: "services.mehmetyigityalim.com", description: "Hizmetler", published: true, order: 4, group_id: services.id}),
        ])

        console.log(`
            Components:
            - mehmetyigityalim.com
            - status.mehmetyigityalim.com
            - api.mehmetyigityalim.com
            - services.mehmetyigityalim.com
        `);
    } catch (error) {
        console.error("Failed to create Components.");
        return;
    }

    // Adding 1 incident

    // Incident
    const incident = await servicesInstance.incident.createIncidentWithImpacts({
        title: "Örnek bir hizmet kesintisi",
        slug: "ornek-bir-hizmet-kesintisi", // sluggify(title)
        description: "Örnek bir hizmet kesintisi açıklaması",
        started_at: new Date("2024-12-27T15:39:00Z"),
        resolved_at: null,
        last_update_at: new Date("2024-12-27T15:39:00Z"),
        message: "Örnek bir hizmet kesintisi mesajı",
    }, [sites.id]) // burada sites.id ör: 1 -> mehmetyigityalim.com için bir incident (olay) oluşturuldu. bu bir dizidir çünkü birden fazla siteye aynı anda etki edebilir.

    if (!incident) {
        console.error("Failed to create Incident.");
        return;
    }

    console.log(`
        Incident:
        - Title: ${incident.title}
        - Slug: ${incident.slug}
        - Description: ${incident.description}
        - Started At: ${incident.started_at}
        - Resolved At: ${incident.resolved_at}
        - Last Update At: ${incident.last_update_at}
        - Message: "Örnek bir hizmet kesintisi mesajı"
    `)

    // Incident Updates

    const [
        detected,
        investigating,
        identified,
        resolving,
        monitoring,
        resolved,
        closed,
    ] = await Promise.all([
        await servicesInstance.incidentUpdate.addIncidentUpdateToIncident({
            status: "detected",
            published: true,
            title: "Örnek bir hizmet kesintisi güncellemesi",
            content: "Örnek bir hizmet kesintisi güncellemesi açıklaması",
        }, incident.id),
        await servicesInstance.incidentUpdate.addIncidentUpdateToIncident({
            status: "investigating",
            published: true,
            title: "Örnek bir hizmet kesintisi güncellemesi",
            content: "Örnek bir hizmet kesintisi güncellemesi açıklaması",
        }, incident.id),
        await servicesInstance.incidentUpdate.addIncidentUpdateToIncident({
            status: "identified",
            published: true,
            title: "Örnek bir hizmet kesintisi güncellemesi",
            content: "Örnek bir hizmet kesintisi güncellemesi açıklaması",
        }, incident.id),
        await servicesInstance.incidentUpdate.addIncidentUpdateToIncident({
            status: "resolving",
            published: true,
            title: "Örnek bir hizmet kesintisi güncellemesi",
            content: "Örnek bir hizmet kesintisi güncellemesi açıklaması",
        }, incident.id),
        await servicesInstance.incidentUpdate.addIncidentUpdateToIncident({
            status: "monitoring",
            published: true,
            title: "Örnek bir hizmet kesintisi güncellemesi",
            content: "Örnek bir hizmet kesintisi güncellemesi açıklaması",
        }, incident.id),
        await servicesInstance.incidentUpdate.addIncidentUpdateToIncident({
            status: "resolved",
            published: true,
            title: "Örnek bir hizmet kesintisi güncellemesi",
            content: "Örnek bir hizmet kesintisi güncellemesi açıklaması",
        }, incident.id),
        await servicesInstance.incidentUpdate.addIncidentUpdateToIncident({
            status: "closed",
            published: true,
            title: "Örnek bir hizmet kesintisi güncellemesi",
            content: "Örnek bir hizmet kesintisi güncellemesi açıklaması",
        }, incident.id),
    ])

    if (!detected || !investigating || !identified || !resolving || !monitoring || !resolved || !closed) {
        console.error("Failed to create Incident Updates.");
        return;
    }

    console.log(`
        Incident Updates:
        - Detected: ${detected.id}
        - Investigating: ${investigating.id}
        - Identified: ${identified.id}
        - Resolving: ${resolving.id}
        - Monitoring: ${monitoring.id}
        - Resolved: ${resolved.id}
        - Closed: ${closed.id}
    `);

    // Scheduled Maintenance

    const scheduledMaintenance = await servicesInstance.scheduledMaintenance.createScheduledMaintenance({
        name: "Örnek bir planlı bakım",
        description: "Örnek bir planlı bakım açıklaması",
        status: "scheduled", // scheduled, in_progress, completed
        component: sites.id, // mehmetyigityalim.com
        scheduled_start_time: new Date("2024-12-27T15:39:00Z"), // 27 Aralık 2024 15:39
        scheduled_end_time: addDays(new Date("2024-12-27T15:39:00Z"), 1), // 28 Aralık 2024 15:39
        actual_start_time: null,
        actual_end_time: null,
    });

    if (!scheduledMaintenance) {
        console.error("Failed to create Scheduled Maintenance.");
        return;
    }

    console.log(`
        Scheduled Maintenance:
        - Name: ${scheduledMaintenance.name}
        - Description: ${scheduledMaintenance.description}
        - Status: ${scheduledMaintenance.status}
        - Component: ${scheduledMaintenance.component}
        - Scheduled Start Time: ${scheduledMaintenance.scheduled_start_time}
        - Scheduled End Time: ${scheduledMaintenance.scheduled_end_time}
        - Actual Start Time: ${scheduledMaintenance.actual_start_time}
        - Actual End Time: ${scheduledMaintenance.actual_end_time}
    `);

    // Scheduled Maintenance Updates

    const updateScheduledMaintenance = await servicesInstance.scheduledMaintenance.createUpdateForScheduledMaintenance({
        published: true,
        status: "detected",
        title: "Örnek bir planlı bakım güncellemesi",
        content: "Örnek bir planlı bakım güncellemesi açıklaması",
    }, scheduledMaintenance.id);
    // burada sadece 1 tane update eklendi çünkü incident update ile aynı mantıkta çalışıyor.

    if (!updateScheduledMaintenance) {
        console.error("Failed to create Update for Scheduled Maintenance.");
        return;
    }

    console.log(`
        Update for Scheduled Maintenance:
        - Status: ${updateScheduledMaintenance.status}
        - Title: ${updateScheduledMaintenance.title}
        - Content: ${updateScheduledMaintenance.content}
    `);

    // NOT: incident_impact tablosuna seed işlemi yapılmadı çünkü zaten o bir bağlayıcı tablo. biz incident ve component create ettiğimiz zaman yazılan servis metodu bunu otomatik olarak yapacak.

    const end = performance.now();

    console.log(`Seeding completed in %c${(end - start).toFixed(2)}ms`, "color: green; font-weight: bold; font-size: 16px;");

    return void 0;
}

seed().catch(console.error);