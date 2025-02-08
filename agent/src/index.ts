import * as dotenv from 'dotenv';
import { validateAutonomousMode, validateEnvironment } from './utils/config';
import { initializeChatBot } from './agents/chatbot';
import { chooseMode } from './utils/chooseMode';
import { runChatMode } from './modes/runChatMode';
import { initializeWalletAgent } from './agents/walletAgent';
import { initializeOracleAgent } from './agents/oracleAgent';
import { runAgentsInAutonomousMode } from './modes/runAgents';
import { configureWallet } from './utils/wallet';

dotenv.config();
validateEnvironment();

async function main() {

  const wallet = await configureWallet();
  
  const agents = [
    await initializeOracleAgent(),
    await initializeWalletAgent(wallet),
    await initializeChatBot(wallet),
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