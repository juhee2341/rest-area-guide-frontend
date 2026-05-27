import { fetchRestAreas } from "@/lib/expressway";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await fetchRestAreas();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
