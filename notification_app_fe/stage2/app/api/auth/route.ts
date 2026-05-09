// app/api/auth/route.ts

import { NextResponse } from "next/server";

const BASE_URL = "http://4.224.186.213/evaluation-service";

export async function GET() {
  try {
    const payload = {
      email: process.env.NEXT_PUBLIC_EMAIL,
      name: process.env.NEXT_PUBLIC_NAME,
      rollNo: process.env.NEXT_PUBLIC_ROLL_NO,
      accessCode: process.env.NEXT_PUBLIC_ACCESS_CODE,
      clientID: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
    };

    const res = await fetch(`${BASE_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    console.log("[SERVER AUTH RESPONSE]", data);

    return NextResponse.json(data);
  } catch (err) {
    console.error("[SERVER AUTH ERROR]", err);

    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}