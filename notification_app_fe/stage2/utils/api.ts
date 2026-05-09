// utils/api.ts
// All API calls to Affordmed test server

import { FetchParams, NotificationsResponse } from "../types/notification";
import { Log } from "./logger";

const BASE_URL = "http://4.224.186.213/evaluation-service";

export async function getAuthToken(): Promise<string> {
  try {
    const res = await fetch("/api/auth");

    const data = await res.json();

    console.log("AUTH RESPONSE =", data);

    if (!res.ok) {
      throw new Error(data.error || "Authentication failed");
    }

    return data.access_token || "";
  } catch (err) {
    console.error("[Auth] Failed:", err);
    return "";
  }
}

export async function fetchNotifications(
  token: string,
  params: FetchParams = {}
): Promise<NotificationsResponse> {
  const query = new URLSearchParams();

  if (params.limit) {
    query.set("limit", String(params.limit));
  }

  if (params.page) {
    query.set("page", String(params.page));
  }

  if (params.notification_type) {
    query.set(
      "notification_type",
      params.notification_type
    );
  }

  const url = `/api/notifications${
    query.toString() ? `?${query.toString()}` : ""
  }`;

  await Log(
    "info",
    "api",
    `Fetching notifications: ${JSON.stringify(params)}`
  );

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "API Error");
    }

    await Log(
      "info",
      "api",
      `Fetched ${data.notifications?.length ?? 0} notifications`
    );

    return data;
  } catch (err) {
    await Log(
      "fatal",
      "api",
      `fetchNotifications crashed: ${String(err)}`
    );

    throw err;
  }
}