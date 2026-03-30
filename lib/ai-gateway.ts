import { GoogleGenAI } from "@google/genai";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/** 서버 전용. 클라이언트에 노출하지 않음. */
export function getServerLlmApiKey(): string | undefined {
  const k =
    process.env.OPENROUTER_API_KEY?.trim() ||
    process.env.API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim();
  return k || undefined;
}

function isOpenRouterKey(key: string): boolean {
  return key.startsWith("sk-or-v1-") || key.startsWith("sk-or-");
}

function openRouterModel(googleStyleModel: string): string {
  const fromEnv = process.env.OPENROUTER_MODEL?.trim();
  if (fromEnv) return fromEnv;
  if (googleStyleModel.includes("gemini")) {
    return "google/gemini-2.0-flash-001";
  }
  return "google/gemini-2.0-flash-001";
}

/** Gemini SDK config (구조화 출력, systemInstruction, thinkingConfig 등) 전달용 */
export type LlmGenConfig = Record<string, unknown>;

export type GenerateLlmArgs = {
  contents: string;
  model?: string;
  config?: LlmGenConfig;
};

/**
 * Google AI 직접 키(AIza…)는 Gemini SDK, OpenRouter 키(sk-or-…)는 OpenRouter API로 분기.
 */
export async function generateLlmContent(
  args: GenerateLlmArgs
): Promise<{ text?: string }> {
  const apiKey = getServerLlmApiKey();
  if (!apiKey) return { text: undefined };

  const model = args.model ?? "gemini-3-flash-preview";

  if (!isOpenRouterKey(apiKey)) {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: args.contents,
      ...(args.config ? { config: args.config as Record<string, unknown> } : {}),
    });
    return { text: response.text };
  }

  let userContent = args.contents;
  const sys = args.config?.systemInstruction;
  if (typeof sys === "string" && sys.trim()) {
    userContent = `System instructions:\n${sys.trim()}\n\n---\n\n${userContent}`;
  }

  const wantsJson = args.config?.responseMimeType === "application/json";
  if (wantsJson) {
    userContent += "\n\nRespond with ONLY valid JSON. No markdown fences, no explanation before or after.";
    const schema = args.config?.responseSchema;
    if (schema !== undefined) {
      try {
        userContent += `\n\nTarget shape (schema hints):\n${JSON.stringify(schema)}`;
      } catch {
        /* ignore */
      }
    }
  }

  const maxTok = args.config?.maxOutputTokens;
  const body: Record<string, unknown> = {
    model: openRouterModel(model),
    messages: [{ role: "user", content: userContent }],
  };
  if (typeof maxTok === "number" && maxTok > 0 && maxTok <= 8192) {
    body.max_tokens = maxTok;
  }
  if (wantsJson) {
    body.response_format = { type: "json_object" };
  }

  const referer =
    process.env.OPENROUTER_HTTP_REFERER?.trim() || "http://localhost:3002";
  const title = process.env.OPENROUTER_APP_TITLE?.trim() || "jeiolab";

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": referer,
      "X-Title": title,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${errText}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const raw = data.choices?.[0]?.message?.content;
  const text = typeof raw === "string" ? raw : undefined;
  return { text };
}
