import { redirect } from "remix";
import { getUserId } from "~/auth.server";

export async function requireAuthentication(request: Request) {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }
}
