import { fermerSession } from "@/lib/session";

export async function POST() {
  await fermerSession();
  return Response.json({ ok: true });
}
