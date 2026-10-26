import { afterEach, beforeAll, expect, test } from "bun:test";

process.env.TELEGRAM_BOT_TOKEN = "t";
process.env.TELEGRAM_CHAT_IDS = "1";
let sendTelegram: (t: string) => Promise<boolean>;
const realFetch = globalThis.fetch;

beforeAll(async () => {
  ({ sendTelegram } = await import("../src/telegram.ts"));
});
afterEach(() => {
  globalThis.fetch = realFetch;
});

function stub(statuses: number[]) {
  const bodies: Record<string, unknown>[] = [];
  globalThis.fetch = (async (_u: unknown, init: RequestInit) => {
    bodies.push(JSON.parse(String(init.body)));
    return new Response("err", { status: statuses.shift() ?? 200 });
  }) as unknown as typeof fetch;
  return bodies;
}

test("400 com Markdown é reenviado como texto simples", async () => {
  const bodies = stub([400, 200]);
  expect(await sendTelegram("a_b*")).toBe(true);
  expect(bodies).toHaveLength(2);
  expect(bodies[0]?.parse_mode).toBe("Markdown");
  expect(bodies[1]?.parse_mode).toBeUndefined();
});

test("falha persistente retorna false", async () => {
  stub([400, 500]);
  expect(await sendTelegram("x")).toBe(false);
});

test("sucesso direto envia uma vez", async () => {
  expect(stub([200])).toBeDefined();
  expect(await sendTelegram("x")).toBe(true);
});
