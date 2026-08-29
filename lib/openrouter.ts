interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const FREE_MODELS = [
  "meta-llama/llama-3.1-8b-instruct:free",
  "google/gemma-2-9b-it:free",
  "mistralai/mistral-7b-instruct:free",
];

export async function callOpenRouter(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

  let lastError: unknown;

  for (const model of FREE_MODELS) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://ryan.evelyn",
          "X-Title": "ryan.evelyn portfolio",
        },
        body: JSON.stringify({ model, messages, max_tokens: 120 }),
        signal: AbortSignal.timeout(15_000),
      });

      if (!res.ok) {
        lastError = new Error(`OpenRouter ${model} responded ${res.status}`);
        continue;
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (typeof content === "string" && content.trim()) {
        return content.trim();
      }
      lastError = new Error(`OpenRouter ${model} returned empty content`);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("All OpenRouter models failed");
}
