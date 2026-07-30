import { NextResponse } from "next/server";

import {
  demoAdminCookieName,
  isDemoAdminEnabled,
} from "@/lib/auth/demo-admin";

export function GET(request: Request) {
  const url = new URL(request.url);

  if (!isDemoAdminEnabled()) {
    url.pathname = "/auth/login";
    url.searchParams.set("error", "demo-admin-disabled");
    return NextResponse.redirect(url);
  }

  url.pathname = "/protected/context";
  url.search = "";

  const response = NextResponse.redirect(url);
  response.cookies.set(demoAdminCookieName, "enabled", {
    httpOnly: true,
    maxAge: 60 * 60 * 8,
    path: "/",
    sameSite: "lax",
    secure: process.env.VERCEL_ENV === "production",
  });

  return response;
}

export function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(demoAdminCookieName, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.VERCEL_ENV === "production",
  });

  return response;
}
