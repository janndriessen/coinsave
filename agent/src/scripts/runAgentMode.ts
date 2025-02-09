import * as dotenv from 'dotenv';
import { validateEnvironment } from '../utils/config';
import { initializeChatBot } from '../agents/chatbot';
import { initializeWalletAgent } from '../agents/walletAgent';
import { initializeOracleAgent } from '../agents/oracleAgent';
import { runAgentsInAutonomousMode } from '../modes/runAgents';

import { configureWallet } from '../utils/wallet';
import type { Agent } from '../utils/types';

dotenv.config();
validateEnvironment();

async function runAgentMode(
  amountPerEpoch: number,
  interval: number,
  epochLength: number
): Promise<Agent[]> {
  const wallet = await configureWallet();

  const agents = [
    await initializeOracleAgent(wallet),
    await initializeWalletAgent(wallet),
    await initializeChatBot(wallet),
  ];

  console.log('Starting autonomous mode...');
  await runAgentsInAutonomousMode(
    agents[0],
    agents[1],
    amountPerEpoch,
    epochLength,
    interval
  );

  return agents;
}

if (require.main === module) {
  console.log('Starting Agent...');
  const interval = 10;

  const amountPerEpoch = 10;
  const epochLength = 60 * 60 * 24; // 1 day

  runAgentMode(amountPerEpoch, interval, epochLength).catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
