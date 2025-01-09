import { db } from "./db";
import { members, organizations, projects, sessions } from "./schema";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import slugify from "slugify";

export const getDefaultOrganization = async (userId: string) => {
    return db
        .select()
        .from(members)
        .where(eq(members.userId, userId))
        .leftJoin(organizations, eq(organizations.id, members.organizationId))
        .limit(1)
        .get();
};

export async function createDefaultOrganization(user: {
    id: string;
    name: string;
}) {
    // Yeni kullanıcı için varsayılan organizasyon oluştur
    const org = db
        .insert(organizations)
        .values({
            name: user.name,
            slug: `${slugify(user.name, { lower: true })}-default-org-${createId().slice(0, 8)}`,
        })
        .returning()
        .get();

    // Kullanıcıyı organizasyonun üyesi olarak ekle
    await db.insert(members).values({
        userId: user.id,
        organizationId: org.id,
        role: "owner",
    });

    // Yeni organizasyon için varsayılan proje oluştur
    await db.insert(projects).values({
        name: "Default",
        organizationId: org.id,
        slug: "default",
    });

    // Yeni kullanıcının oturumu için etkin organizasyonu ayarla
    await db
        .update(sessions)
        .set({ activeOrganizationId: org.id })
        .where(eq(sessions.userId, user.id));

    return org;
}