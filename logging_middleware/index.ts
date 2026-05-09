// logging_middleware/index.ts
// Core reusable logging function - sends logs to Affordmed test server

const BASE_URL = "http://4.224.186.213/evaluation-service";

// We store the token here after authentication
let authToken: string = "";

// Call this after you get your token from auth API
export function setAuthToken(token: string) {
  authToken = token;
}

// This is the main Log function
// Usage: Log("frontend", "info", "page", "User visited homepage")
export async function Log(
  stack: "frontend" | "backend",
  level: "debug" | "info" | "warn" | "error" | "fatal",
  pkg:
    | "api"
    | "component"
    | "hook"
    | "page"
    | "state"
    | "style"
    | "auth"
    | "config"
    | "middleware"
    | "utils",
  message: string
) {
  // Don't attempt to log if token is missing
  if (!authToken) {
    console.warn("[LOGGER] No auth token set. Call setAuthToken() first.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });

    const data = await response.json();
    console.log(
      `[LOG ✓] ${stack} | ${level.toUpperCase()} | ${pkg} → "${message}"`
    );
    return data; // { logID, message: "log created successfully" }
  } catch (error) {
    console.error("[LOG FAILED]", error);
  }
}