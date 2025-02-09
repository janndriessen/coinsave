import * as dotenv from 'dotenv';
import Fastify from 'fastify';
import { validateEnvironment } from './utils/config';
import { initializeChatBot } from './agents/chatbot';
import { runChatMode } from './modes/runChatMode';
import { initializeWalletAgent } from './agents/walletAgent';
import { initializeOracleAgent } from './agents/oracleAgent';
import { runAgentsInAutonomousMode } from './modes/runAgents';

import { configureWallet } from './utils/wallet';
import type { Agent } from './utils/types';

dotenv.config();
validateEnvironment();

async function startAgents(
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

const fastify = Fastify({ logger: true });
interface UpdateDCARequestBody {
  amountPerEpoch: number;
  interval: number;
  epochLength: number;
}

fastify.put('/update-dca', async (request, reply) => {
  const { amountPerEpoch, interval, epochLength } =
    request.body as UpdateDCARequestBody;
  console.log(request.body);

  await startAgents(amountPerEpoch, interval, epochLength);

  console.log('hello');

  return reply.send({ response: 'hello' });
});

// Start the server
fastify.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info('Server running on port 3000');
});
