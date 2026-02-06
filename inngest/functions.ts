import prisma from "@/lib/prisma";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";

const google = createGoogleGenerativeAI();
const openai = createOpenAI({
  headers: {
    "header-name": "header-value",
  },
});
const anthropic = createAnthropic({});

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    await step.sleep("pretend-to-work", "5s");

    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-flash-latest"),
        system: "You are a helpful assistant.",
        prompt: "What is 2+2?",
      },
    );

    // const { steps: anthropicSteps } = await step.ai.wrap(
    //   "anthropic-generate-text",
    //   generateText,
    //   {
    //     model: anthropic("claude-sonnet-4-5"),
    //     system: "You are a helpful assistant.",
    //     prompt: "What is 2+2?",
    //   },
    // );

    // const { steps: openaiSteps } = await step.ai.wrap(
    //   "openai-generate-text",
    //   generateText,
    //   {
    //     model: openai("chatgpt-4o-latest"),
    //     system: "You are a helpful assistant.",
    //     prompt: "What is 2+2?",
    //   },
    // );

    return { geminiSteps };
  },
);
