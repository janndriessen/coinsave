import * as dotenv from 'dotenv';
import { validateEnvironment } from './utils/config';
import { initializeChatBot } from './agents/chatbot';
import { runAutonomousMode } from './modes/runAutonomousMode';
import { chooseMode } from './modes/chooseMode';
import { runChatMode } from './modes/runChatMode';

dotenv.config();
validateEnvironment();



async function main() {
    const chatBot = await initializeChatBot();

    const agents = [chatBot];

    const mode = await chooseMode();
  if (mode === "auto") {
    await runAutonomousMode(agents);
  } else {
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