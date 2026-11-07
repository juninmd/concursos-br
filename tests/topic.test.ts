import { expect, test } from "bun:test";
import { topic } from "../src/topic.ts";

test("define topic with configured concursos feeds", () => {
  expect(topic.name).toBe("concursos-br");
  expect(topic.title).toBe("Concursos Radar");
  expect(topic.emoji).toBe("📋");
  expect(topic.feeds.length).toBeGreaterThan(0);
  expect(topic.systemPrompt).toContain("orientador de concursos");
});
