// app/api/logs/route.ts

import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "http://4.224.186.213/evaluation-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const authHeader = req.headers.get("authorization");

    const res = await fetch(`${BASE_URL}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("[SERVER LOG ERROR]", err);

    return NextResponse.json(
      { error: "Logging failed" },
      { status: 500 }
    );
  }
}