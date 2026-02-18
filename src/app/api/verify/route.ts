import { NextRequest, NextResponse } from "next/server";
import { verifyDocumentByHash } from "@/actions/documents";
import { rateLimit } from "@/lib/redis";

/**
 * Public verification API
 * GET /api/verify?hash=0x...
 * Rate limited: 60 requests/minute per IP
 */
export async function GET(request: NextRequest) {
  const hash = request.nextUrl.searchParams.get("hash");
  if (!hash) {
    return NextResponse.json(
      { error: "Missing hash parameter" },
      { status: 400 }
    );
  }

  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const { success } = await rateLimit(`verify:${ip}`, 60, 60);
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }
  } catch {
    // Redis unavailable - allow request
  }

  try {
    const result = await verifyDocumentByHash(hash);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Verification failed" },
      { status: 400 }
    );
  }
}
