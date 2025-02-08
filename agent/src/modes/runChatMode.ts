import { HumanMessage } from "@langchain/core/messages";
import * as readline from "readline";
import { Agent } from "../utils/types";

export async function runChatMode(chatBots: Agent[]) {
  console.log("Starting chat mode... Type 'exit' to end.");

  const model_id = await chooseModel(chatBots);
  const {agent, config} = chatBots[model_id];

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
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  } finally {
    rl.close();
  }
}

export async function chooseModel(chatBots: Agent[]): Promise<number> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> =>
    new Promise(resolve => rl.question(prompt, resolve));

  console.log("Available ChatBots:");

  let thread_ids = [];
  for (let i = 0; i < chatBots.length; i++) {
    const thread_id = chatBots[i].config.configurable.thread_id;
    thread_ids.push(thread_id);
    console.log(`${i}    - ${thread_id}`);
  }

  while (true) {
    const choice = (await question("\nChoose a mode (enter number): "))
      .toLowerCase()
      .trim();

    try {
      const choice_int = parseInt(choice);
      if (choice_int < chatBots.length) {
        rl.close();
        console.log(`Selected: ${thread_ids[choice_int]}`);
        return choice_int;
      }
    } catch {}

    console.error(`Invalid choice. Please try again.`);
  }
}