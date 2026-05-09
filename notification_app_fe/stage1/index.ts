// index.ts
// Stage 1 — Priority Inbox
// Fetches notifications and prints top 10 by priority score

import { getTopN, Notification } from "./priorityScore";

const BASE_URL = "http://4.224.186.213/evaluation-service";

// ─── PASTE YOUR TOKEN HERE WHEN READY ───────────────────────
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMjVjczEwMDJAaWlpdGsuYWMuaW4iLCJleHAiOjE3NzgzMDU5NzEsImlhdCI6MTc3ODMwNTA3MSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6Ijc1N2Q1YTY3LTQ2NDctNGMwNS1iZDJlLTZhZGY5NDJkNjQ1NiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InYudi5yYXZpIHRlamEiLCJzdWIiOiJiYmFkYzIwOS1kZDM5LTQ2ZDEtYmEzNC1mMGUyMjQwZjk0MTUifSwiZW1haWwiOiIyMjVjczEwMDJAaWlpdGsuYWMuaW4iLCJuYW1lIjoidi52LnJhdmkgdGVqYSIsInJvbGxObyI6IjIyNWNzMTAwMiIsImFjY2Vzc0NvZGUiOiJ1WnlTQVQiLCJjbGllbnRJRCI6ImJiYWRjMjA5LWRkMzktNDZkMS1iYTM0LWYwZTIyNDBmOTQxNSIsImNsaWVudFNlY3JldCI6IlZ0aER1dXhhRWZ4YndzSGoifQ.qvAi2vKY1FVFQry9kuTr2uDrsjgqSZbbM2bmea2CEzQ";
// ────────────────────────────────────────────────────────────

async function fetchNotifications(): Promise<Notification[]> {
  console.log("Fetching notifications from API...\n");

  const res = await fetch(`${BASE_URL}/notifications`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  // See exact error message
  const data = await res.json();
  console.log("API Response:", JSON.stringify(data, null, 2));

  if (!res.ok) {
    throw new Error(`API call failed with status: ${res.status}`);
  }

  return data.notifications ?? [];
}

async function main() {
  try {
    const notifications = await fetchNotifications();
    console.log(`Total notifications fetched: ${notifications.length}`);
    console.log("─".repeat(60));

    // Get top 10 by priority score
    const top10 = getTopN(notifications, 10);

    console.log("\n🏆 TOP 10 PRIORITY NOTIFICATIONS:\n");
    console.log("─".repeat(60));

    top10.forEach((n, index) => {
      console.log(`#${index + 1}`);
      console.log(`  Type      : ${n.Type}`);
      console.log(`  Message   : ${n.Message}`);
      console.log(`  Timestamp : ${n.Timestamp}`);
      console.log(`  Score     : ${n.score.toFixed(2)}`);
      console.log("─".repeat(60));
    });

    console.log("\n✅ Priority scoring complete!");
    console.log("\nScoring Logic:");
    console.log("  Placement = 30 pts (base weight)");
    console.log("  Result    = 20 pts (base weight)");
    console.log("  Event     = 10 pts (base weight)");
    console.log("  Recency   = up to 10 bonus pts (decays over 48hrs)");

  } catch (err) {
    console.error("❌ Error:", err);
  }
}

main();