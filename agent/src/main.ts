import * as dotenv from 'dotenv';
import { validateAutonomousMode, validateEnvironment } from './utils/config';
import { initializeChatBot } from './agents/chatbot';
import { runAutonomousMode } from './modes/runAutonomousMode';
import { chooseMode } from './modes/chooseMode';
import { runChatMode } from './modes/runChatMode';
import { initializeWalletAgent } from './agents/walletAgent';
import { initializePriceAgent } from './agents/priceAgent';
import { runAgentsInAutonomousMode } from './modes/runAgents';

dotenv.config();
validateEnvironment();

async function main() {

  const agents = [
    await initializePriceAgent(),
    await initializeWalletAgent(),
    await initializeChatBot(),
  ];

  //const mode = await chooseMode();
  const mode = process.env.INTERACTIVE_MODE === 'true' ? "chat" : "auto";

  if (mode === "auto") {
    console.log("Starting autonomous mode...");
    validateAutonomousMode();
    await runAgentsInAutonomousMode(agents[0], agents[1]);
  } else {
    console.log("Starting chat mode...");
    await runChatMode(agents);
  }

}

if (require.main === module) {
  console.log("Starting Agent...");
  main().catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}