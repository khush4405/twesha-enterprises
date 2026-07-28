import { NextResponse } from "next/server";
import { getGitStatus } from "@/lib/git";

export async function GET() {
  try {
    const status = await getGitStatus();
    return NextResponse.json(status);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
