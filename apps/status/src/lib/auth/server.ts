import {db, organizations} from "@/db/db";
import * as schema from "@/db/schema";
import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {nextCookies} from "better-auth/next-js";
import {createDefaultOrganization, getDefaultOrganization} from "@/db/auth";
import {organization} from "better-auth/plugins";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        usePlural: true,
        schema,
    }),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_BASE_URL,
    emailAndPassword: {
        enabled: true
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    const org = await createDefaultOrganization(user);

                    // Yeni kullanıcıya hoş geldin e-postası gönder
                    try {
                        /*await resend.emails.send({
                            from: "Statuspage <hello@mehmetyigityalim.com>",
                            to: user.email,
                            subject: "Welcome to Statuspage",
                            react: <WelcomeEmail user={user} org={org} />,
                        });
                         */
                    } catch (error) {
                        console.error("Error sending welcome email", error);
                    }
                },
            },
        },
        session: {
            create: {
                before: async (session) => {
                    const org = await getDefaultOrganization(session.userId);

                    return {
                        data: {
                            ...session,
                            activeOrganizationId: org?.organizations?.id,
                        },
                    };
                },
            },
        },
    },
    plugins: [nextCookies(), organization()],
});

/*
ROLE:
import { createAccessControl } from "better-auth/plugins/access";

const statement = {
    project: ["create", "share", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

const member = ac.newRole({
    project: ["create"],
});

const admin = ac.newRole({
    project: ["create", "update"],
});

const owner = ac.newRole({
    project: ["create", "update", "delete"],
});

const myCustomRole = ac.newRole({
    project: ["create", "update", "delete"],
    organization: ["update"],
});

-------

import { createAccessControl, defaultStatements, adminAc } from "better-auth/plugins/access";

const statement = {
    ...defaultStatements,
    project: ["create", "share", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

const admin = ac.newRole({
    project: ["create", "update"],
    ...adminAc.statements,
});

-------
plugins: [
        organization({
            ac: ac,
            roles: {
                owner,
                admin,
                member,
                myCustomRole
            }
        }),
    ],

-------
auth.api.hasPermission({
        headers: await headers(),
        body: {
            permission: {
                project: ["create"] // This must match the structure in your access control
            }
        }
    });
 */

export type Session = typeof auth.$Infer.Session