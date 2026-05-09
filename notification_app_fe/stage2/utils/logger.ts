// utils/logger.ts

let authToken = "";

export function setAuthToken(token: string) {
  authToken = token;
  console.log("[LOGGER] Token set");
}

export type LogLevel =
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "fatal";

export type FrontendPackage =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style"
  | "auth"
  | "config"
  | "middleware"
  | "utils";

export async function Log(
  level: LogLevel,
  pkg: FrontendPackage,
  message: string
) {
  if (!authToken) {
    console.warn("[Logger] No token yet:", message);
    return;
  }

  try {
    const res = await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        stack: "frontend",
        level,
        package: pkg,
        message,
      }),
    });

    const data = await res.json();

    console.log("[LOG SUCCESS]", data);

    return data;
  } catch (err) {
    console.error("[Logger] Failed:", err);
  }
}