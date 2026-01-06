import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { inngest } from "./client";
import { firecrawl } from "@/lib/firecrawl";

const URL_REGEX = /https?:\/\/[^\s]+/g;

export const demoGenerate = inngest.createFunction(
  { id: "demo-generate" },
  { event: "demo/generate" },
  async ({ event, step }) => {
    const { prompt } = event.data as { prompt: string };

    // 1. 提取 URL
    const urls = (await step.run("extract-urls", async () => {
      return prompt.match(URL_REGEX) ?? [];
    })) as string[];

    // 2. 爬取网页内容
    const scrapedContent = (await step.run("scrape-urls", async () => {
      const results = await Promise.all(
        urls.map(async (url) => {
          const result = await firecrawl.scrape(url, {
            formats: ["markdown"],
          });
          return result.markdown ?? null;
        })
      );
      return results.filter(Boolean).join("\n\n");
    })) as string;

    // 3. 构建最终 Prompt
    const finalPrompt = scrapedContent
      ? `Context:\n${scrapedContent}\n\nQuestion: ${prompt}`
      : prompt;

    // 4. 调用 AI 生成
    return await step.run("generate-text", async () => {
      const response = await generateText({
        model: google("gemini-2.5-flash"),
        prompt: finalPrompt,
      });
      return { text: response.text };
    });
  }
);
