import * as dotenv from 'dotenv';
import { validateEnvironment } from '../utils/config';
import { initializeChatBot } from '../agents/chatbot';
import { runChatMode } from '../modes/runChatMode';
import { initializeWalletAgent } from '../agents/walletAgent';
import { initializeOracleAgent } from '../agents/oracleAgent';
import { configureWallet } from '../utils/wallet';


dotenv.config();
validateEnvironment();

async function main() {

    const wallet = await configureWallet();

    const agents = [
        await initializeOracleAgent(wallet),
        await initializeWalletAgent(wallet),
        await initializeChatBot(wallet),
    ];

    await runChatMode(agents);
}

if (require.main === module) {
    console.log("Starting Agent...");
    main().catch(error => {
        console.error("Fatal error:", error);
        process.exit(1);
    });
}