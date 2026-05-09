// app/api/notifications/route.ts

import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "http://4.224.186.213/evaluation-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const limit = searchParams.get("limit");
    const page = searchParams.get("page");
    const notification_type =
      searchParams.get("notification_type");

    const query = new URLSearchParams();

    if (limit) query.set("limit", limit);
    if (page) query.set("page", page);
    if (notification_type) {
      query.set("notification_type", notification_type);
    }

    const authHeader = req.headers.get("authorization");

    const url = `${BASE_URL}/notifications${
      query.toString() ? `?${query.toString()}` : ""
    }`;

    console.log("[SERVER NOTIFICATIONS URL]", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: authHeader || "",
      },
      cache: "no-store",
    });

    const data = await res.json();

    console.log("[SERVER NOTIFICATIONS RESPONSE]", data);

    return NextResponse.json(data);
  } catch (err) {
    console.error("[SERVER NOTIFICATIONS ERROR]", err);

    return NextResponse.json(
      {
        error: "Notifications fetch failed",
      },
      {
        status: 500,
      }
    );
  }
}