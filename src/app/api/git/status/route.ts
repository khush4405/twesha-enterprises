import { NextResponse } from "next/server";
import { getGitStatus } from "@/lib/git";
import { authGuard } from "@/lib/auth-guard";

export async function GET() {
  try {
    const auth = await authGuard();
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const status = await getGitStatus();
    return NextResponse.json(status);
  } catch (err: any) {
    console.error("Git status error:", err);
    return NextResponse.json({ error: "Failed to get git status. Check server logs." }, { status: 500 });
  }
}
