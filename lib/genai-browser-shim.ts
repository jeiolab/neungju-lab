"use client";

import { Type } from "@google/genai";
import type { Schema } from "@google/genai";

export { Type };
export type { Schema };

const MAX_PROMPT_CHARS = 48_000;

/**
 * 브라우저 번들용: API 키는 사용하지 않고 /api/llm/complete 로만 호출합니다.
 * 실제 키는 서버 .env 에만 둡니다.
 */
export class GoogleGenAI {
  constructor(_options: { apiKey: string }) {}

  models = {
    generateContent: async (args: {
      model?: string;
      contents: string;
      config?: Record<string, unknown>;
    }): Promise<{ text?: string }> => {
      let contents = args.contents;
      if (contents.length > MAX_PROMPT_CHARS) {
        contents = contents.slice(0, MAX_PROMPT_CHARS);
      }
      const res = await fetch("/api/llm/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: args.model,
          contents,
          config: args.config,
        }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (res.status === 429) {
        console.warn("LLM API: 요청이 많아 잠시 후 다시 시도해 주세요.");
        return { text: undefined };
      }
      if (!res.ok) {
        console.error("LLM API:", data.error);
        return { text: undefined };
      }
      return { text: data.text };
    },
  };
}
