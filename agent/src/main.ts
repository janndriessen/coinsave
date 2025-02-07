import * as dotenv from 'dotenv';
import { validateEnvironment } from './utils/config';
import { initializeChatBot } from './agents/chatbot';
import { runAutonomousMode } from './modes/runAutonomousMode';
import { chooseMode } from './modes/chooseMode';
import { runChatMode } from './modes/runChatMode';
import { initializeWalletAgent } from './agents/walletAgent';
import { initializePriceAgent } from './agents/priceAgent';

dotenv.config();
validateEnvironment();



async function main() {
  
  const agents = [
    await initializeChatBot(),
    await initializePriceAgent(),
    await initializeWalletAgent()
  ];

  // const mode = await chooseMode();
  // if (mode === "auto") {
  //  await runAgents(agents);
    // } else {
    await runChatMode(agents);
  // }
}

if (require.main === module) {
  console.log("Starting Agent...");
  main().catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}