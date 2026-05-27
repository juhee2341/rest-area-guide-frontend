import { fetchRestAreaDetail } from "@/lib/expressway";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(_req.url);
    const stdRestCd = searchParams.get("stdRestCd") ?? id;
    const data = await fetchRestAreaDetail(id, stdRestCd);
    return NextResponse.json(data);
  } catch (e) {
    console.error("[api/rest-areas/[id]]", (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
