import { NextRequest, NextResponse } from "next/server";
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

const MAX_BODY_BYTES = 512 * 1024;

export async function POST(request: NextRequest) {
  const apiKey = getServerLlmApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured", text: undefined },
      { status: 500 }
    );
  }

  const len = Number(request.headers.get("content-length") || 0);
  if (len > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { contents, model, config } = body as {
    contents?: unknown;
    model?: unknown;
    config?: unknown;
  };

  if (typeof contents !== "string" || contents.length === 0) {
    return NextResponse.json({ error: "contents required" }, { status: 400 });
  }

  if (contents.length > 48_000) {
    return NextResponse.json({ error: "contents too long" }, { status: 400 });
  }

  const safeConfig =
    config && typeof config === "object"
      ? (config as { responseMimeType?: string; responseSchema?: unknown })
      : undefined;

  try {
    const { text } = await generateLlmContent({
      contents,
      model: typeof model === "string" ? model : undefined,
      config: safeConfig,
    });
    return NextResponse.json({ text: text ?? null });
  } catch (e) {
    console.error("LLM complete error:", e);
    return NextResponse.json(
      { error: "LLM request failed", text: null },
      { status: 502 }
    );
  }
}
