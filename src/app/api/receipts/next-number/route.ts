import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const nextNum = await db.getNextSequenceNumber();
    const monthRomawi = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"][new Date().getMonth()];
    const year = new Date().getFullYear();
    
    const formattedNumber = `${nextNum}/PAG-DPM/MOBSOS/${monthRomawi}/${year}`;
    
    const bendahara = await db.getSetting("bendahara_name") || "DIDIK SUBIYANTO";
    
    return NextResponse.json({ 
      success: true, 
      next_number: formattedNumber,
      sequence: nextNum,
      bendahara: bendahara
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
