export const demoAdminCookieName = "analiza_demo_admin";
export const demoAdminEmail = "admin.demo@analiza.local";

export function isDemoAdminEnabled() {
  return (
    process.env.ANALIZA_DISABLE_DEMO_ADMIN !== "true" &&
    process.env.VERCEL_ENV !== "production"
  );
}

export function hasDemoAdminCookie(value: string | undefined) {
  return isDemoAdminEnabled() && value === "enabled";
}

