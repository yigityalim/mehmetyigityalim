import type React from "react";
import {getSession} from "@/lib/session";
import Link from "next/link";
import {SignOutButton} from "@/components/sign-out";
import {redirect} from "next/navigation";
import {authClient} from "@/lib/auth/client";

export default async function DashboardPage() {
    const session = await getSession();
    const organization = await authClient.organization.list();

    if (!session.data) {
        redirect("/sign-in");
    }

    return (
        <div>
                <div>
                    <h1>Dashboard</h1>
                    <pre className="w-full text-wrap">
                        {JSON.stringify(session.data, null, 2)}
                    </pre>
                    <pre className="w-full text-wrap">
                        {JSON.stringify(organization, null, 2)}
                    </pre>
                    <SignOutButton />
                </div>
        </div>
    );
}
