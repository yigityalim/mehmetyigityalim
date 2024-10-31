import { redirect } from "next/navigation";

export default async function RedirectAPIPage() {
  redirect("/v1");
}
