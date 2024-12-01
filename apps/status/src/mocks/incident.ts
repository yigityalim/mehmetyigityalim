import { incidentService } from "@/server/services";
//TODO: HATALI KOD.

async function getMockComponentGroups() {
	return await incidentService.listComponentGroups();
}

async function getMockComponentsByGroupId(groupId: string) {
	return await incidentService.getComponentById(groupId);
}

export async function generateMockComponentGroups() {
	return Promise.all([
		await incidentService.createComponentGroup({
			name: "Sites",
			order: 1,
		}),
		await incidentService.createComponentGroup({
			name: "API",
			order: 2,
		}),
	]);
}

export async function generateMockComponents() {
	const [sites, api] = await getMockComponentGroups();

	if (!sites || !api) {
		throw new Error("Component groups not found");
	}

	const { id: sitesId } = sites;
	const { id: apiId } = api;

	return Promise.all([
		await incidentService.createComponent({
			name: "mehmetyigityalim.com",
			description: "mehmetyigityalim.com",
			order: 1,
			group_id: sitesId,
		}),
		await incidentService.createComponent({
			name: "status.mehmetyigityalim.com",
			description: "Monitoring service-status of api.mehmetyigityalim.com",
			order: 2,
			group_id: apiId,
		}),
		await incidentService.createComponent({
			name: "api.mehmetyigityalim.com",
			description: "API of mehmetyigityalim.com",
			order: 3,
			group_id: apiId,
		}),
		await incidentService.createComponent({
			name: "app.mehmetyigityalim.com",
			description: "App of mehmetyigityalim.com",
			order: 4,
			group_id: sitesId,
		}),
	]);
}

export async function generateMockIncidents() {
	const id = await getMockComponentGroups();
	if (!id || id === undefined) return;
	const mockSite = getMockComponentsByGroupId(id[id.length - 1].id);

	if (!mockSite) {
		throw new Error("Components not found");
	}

	const now = new Date();

	return await Promise.all([
		await incidentService.createIncidentWithImpacts(
			{
				title: "Status Genel Bakımı",
				name: "status-site-maintenance",
				description: "Status sitesi bakım çalışmaları yapılacaktır.",
				impact: "degraded_performance",
				severity: "critical",
				started_at: now,
				message: "Status sitesi bakım çalışmaları yapılacaktır.",
			},
			[mockSite.id],
		),
		await incidentService.createIncidentWithImpacts(
			{
				title: "API GET Hatası",
				name: "api-maintenance",
				description: "API sorgulama hataları yaşanmaktadır.",
				impact: "partial_outage",
				severity: "major",
				started_at: now,
				message: "API bakım çalışmaları yapılacaktır.",
			},
			[mockApi.id],
		),
		await incidentService.createIncidentWithImpacts(
			{
				title: "App erişim sorunu",
				name: "app-maintenance",
				description: "App erişim sorunları yaşanmaktadır.",
				impact: "partial_outage",
				severity: "major",
				started_at: now,
				message: "App bakım çalışmaları yapılacacaktır.",
			},
			[mockSite.id],
		),
	]);
}

export async function generateMockComponentWithUpdates() {
	const [mockSite] = await generateMockComponents();

	if (!mockSite) {
		throw new Error("Components not found");
	}

	const incident = await incidentService.createIncidentWithImpacts(
		{
			title: "App erişim sorunu",
			name: "app-maintenance",
			description: "App erişim sorunları yaşanmaktadır.",
			impact: "partial_outage",
			severity: "major",
			started_at: new Date(),
			message: "App bakım çalışmaları yapılacacaktır.",
		},
		[mockSite.id],
	);

	if (!incident) {
		throw new Error("Incident not found");
	}

	/**
	 * Incident Status Enum
	 * **Detected**: Olay ilk tespit edildiğinde bu durum kullanılır. Bu, otomatik sistemler veya manuel raporlama yoluyla olabilir.
	 * *Investigating**: Ekip olayı araştırmaya başladığında bu durum kullanılır. Bu aşamada, sorunun kapsamı ve nedeni henüz tam olarak bilinmemektedir.
	 * *Identified**: Sorunun kök nedeni belirlendiğinde bu durum kullanılır. Ekip artık sorunu anlamış ve çözüm planı üzerinde çalışmaya başlamıştır.
	 * *Resolving**: Ekip aktif olarak sorunu çözmeye çalışırken bu durum kullanılır. Bu, kod değişiklikleri, sistem yapılandırması güncellemeleri veya diğer düzeltici eylemleri içerebilir.
	 * *Monitoring**: Çözüm uygulandıktan sonra, ekip sistemin stabil olduğundan emin olmak için izleme yaparken bu durum kullanılır.
	 * *Resolved**: Sorun çözüldüğünde ve sistem normal çalışma durumuna döndüğünde bu durum kullanılır.
	 * *Closed**: Olay tamamen kapatıldığında, tüm takip işlemleri tamamlandığında ve bir post-mortem analizi yapıldığında bu durum kullanılır.
	 */

	return Promise.all([
		// detected
		await incidentService.addIncidentUpdateToIncident(
			{
				message: "Olay ilk tespit edildi.",
				status: "investigating",
			},
			incident.id,
		),
		// investigating
		await incidentService.addIncidentUpdateToIncident(
			{
				message: "Sorunun kök nedeni belirlendi.",
				status: "identified",
			},
			incident.id,
		),
		// resolving
		await incidentService.addIncidentUpdateToIncident(
			{
				message: "Çözüm uygulandı.",
				status: "resolved",
			},
			incident.id,
		),
		// monitoring
		await incidentService.addIncidentUpdateToIncident(
			{
				message: "Sistem stabil.",
				status: "monitoring",
			},
			incident.id,
		),
		// resolved
		await incidentService.addIncidentUpdateToIncident(
			{
				message: "Sistem normal çalışıyor.",
				status: "resolved",
			},
			incident.id,
		),
		// closed
		await incidentService.addIncidentUpdateToIncident(
			{
				message: "Olay kapatıldı.",
				status: "closed",
			},
			incident.id,
		),
	]);
}
