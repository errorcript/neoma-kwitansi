import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const donators = await db.getUniqueDonators();
    return NextResponse.json({ success: true, donators });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch donators" }, { status: 500 });
  }
}
