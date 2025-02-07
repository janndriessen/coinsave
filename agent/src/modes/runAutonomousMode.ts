import { HumanMessage } from "@langchain/core/messages";
import { InitializationResult } from "../utils/types";


export async function runAutonomousMode(chatBots: InitializationResult[], interval = 10) {
  console.log("Starting autonomous mode...");

  while (true) {
    try {
      const thought =
        "Be creative and do something interesting on the blockchain. " +
        "Choose an action or set of actions and execute it that highlights your abilities.";

      for (let i = 0; i < chatBots.length; i++) {
        const agent = chatBots[i].agent;
        const config = chatBots[i].config;

        const stream = await agent.stream({ messages: [new HumanMessage(thought)] }, config);

        for await (const chunk of stream) {
          if ("agent" in chunk) {
            console.log(chunk.agent.messages[0].content);
          } else if ("tools" in chunk) {
            console.log(chunk.tools.messages[0].content);
          }
          console.log("-------------------");
        }
      }

      const timeout = interval === 10 ? 5000 : interval * 1000; // Set timeout to 5 seconds if interval is 10
      await new Promise(resolve => setTimeout(resolve, timeout));
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      }
      process.exit(1);
    }
  }
}