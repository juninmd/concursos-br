import { env } from "./config/env.ts";

async function post(chatId: string, text: string, markdown: boolean): Promise<Response> {
  return fetch(`https://api.telegram.org/bot${env.telegramToken}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      ...(markdown ? { parse_mode: "Markdown" } : {}),
      disable_web_page_preview: true,
    }),
  });
}

/**
 * Send a Markdown message to every configured chat. A 400 (usually invalid Markdown
 * entities in LLM output) is retried once as plain text.
 * Returns true when every chunk was delivered (or when printed to the console).
 */
export async function sendTelegram(text: string): Promise<boolean> {
  if (!env.telegramToken || !env.telegramChatIds.length) {
    console.log("[telegram] não configurado — imprimindo no console:\n");
    console.log(text);
    return true;
  }
  let ok = true;
  for (const chatId of env.telegramChatIds) {
    for (const chunk of split(text, 3800)) {
      let res = await post(chatId, chunk, true);
      if (res.status === 400) {
        console.error(`[telegram] 400 com Markdown: ${await res.text()} — reenviando como texto simples`);
        res = await post(chatId, chunk, false);
      }
      if (!res.ok) {
        console.error(`[telegram] ${res.status}: ${await res.text()}`);
        ok = false;
      }
    }
  }
  return ok;
}

function split(text: string, max: number): string[] {
  if (text.length <= max) return [text];
  const out: string[] = [];
  let buf = "";
  for (const line of text.split("\n")) {
    if (buf.length + line.length + 1 > max) {
      out.push(buf);
      buf = "";
    }
    buf += `${line}\n`;
  }
  if (buf) out.push(buf);
  return out;
}
