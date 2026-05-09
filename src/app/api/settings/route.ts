import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const bendahara_name = await db.getSetting('bendahara_name');
  return NextResponse.json({ bendahara_name });
}
