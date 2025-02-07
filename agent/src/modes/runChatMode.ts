import { HumanMessage } from "@langchain/core/messages";
import * as readline from "readline";
import { InitializationResult } from "../utils/types";

export async function runChatMode(chatBots: InitializationResult[]) {
  console.log("Starting chat mode... Type 'exit' to end.");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> =>
    new Promise(resolve => rl.question(prompt, resolve));

  try {
    while (true) {
      const userInput = await question("\nPrompt: ");

      if (userInput.toLowerCase() === "exit") {
        break;
      }

      for (let i = 0; i < chatBots.length; i++) {
        const agent = chatBots[i].agent;
        const config = chatBots[i].config;

        const stream = await agent.stream({ messages: [new HumanMessage(userInput)] }, config);

        for await (const chunk of stream) {
          if ("agent" in chunk) {
            console.log(chunk.agent.messages[0].content);
          } else if ("tools" in chunk) {
            console.log(chunk.tools.messages[0].content);
          }
          console.log("-------------------");
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  } finally {
    rl.close();
  }
}