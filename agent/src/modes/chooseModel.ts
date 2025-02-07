import * as readline from "readline";
import { ChatBot } from "../utils/types";

export async function chooseModel(chatBots: ChatBot[]): Promise<number> {
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