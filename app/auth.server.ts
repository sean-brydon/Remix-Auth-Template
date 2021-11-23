import { db } from "~/utils/db.server";
import bcrypt from "bcrypt";
import { createCookieSessionStorage, redirect } from "remix";
import { destroySession } from "./session.server";

type LoginForm = {
  username: string;
  password: string;
};

export async function login({ username, password }: LoginForm) {
  let user = await db.user.findUnique({
    where: { username },
  });
  if (!user) return null;

  let isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) return null;

  return user;
}

export async function register({ username, password }: LoginForm) {
  let passwordHash = await bcrypt.hash(password, 10);
  return db.user.create({
    data: { username, passwordHash },
  });
}

let sessionSecret = process.env.COOKIE_SECRET ?? "SET_YOUR_COOKIE_SECRET";

let storage = createCookieSessionStorage({
  cookie: {
    name: "Session",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(userId: number, redirectTo: string) {
  let session = await storage.getSession();
  session.set("userId", userId.toString());
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  let session = await getUserSession(request);
  let userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  let session = await getUserSession(request);
  let userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function logout(request: Request) {
  let session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
