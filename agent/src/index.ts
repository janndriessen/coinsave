import * as dotenv from 'dotenv';
import Fastify from 'fastify';
import { validateAutonomousMode, validateEnvironment } from './utils/config';
import { initializeChatBot } from './agents/chatbot';
import { runChatMode } from './modes/runChatMode';
import { initializeWalletAgent } from './agents/walletAgent';
import { initializeOracleAgent } from './agents/oracleAgent';
import { runAgentsInAutonomousMode } from './modes/runAgents';
import { configureWallet } from './utils/wallet';
import type { Agent } from './utils/types';

dotenv.config();
validateEnvironment();

let agents: Agent[];

async function main(): Promise<Agent[]> {
  const wallet = await configureWallet();

  const agents = [
    await initializeOracleAgent(wallet),
    await initializeWalletAgent(wallet),
    await initializeChatBot(wallet),
  ];

  //const mode = await chooseMode();
  const mode = process.env.INTERACTIVE_MODE === 'true' ? 'chat' : 'auto';

  if (mode === 'auto') {
    console.log('Starting autonomous mode...');
    validateAutonomousMode();
    await runAgentsInAutonomousMode(agents[0], agents[1]);
  } else {
    console.log('Starting chat mode...');
    await runChatMode(agents);
  }

  return agents;
}

async function startAgents() {
  agents = await main();
}

startAgents();

const fastify = Fastify({ logger: true });

fastify.put('/update-dca', async (request, reply) => {
  // const { message } = request.body;
  console.log(request.body);

  // if (!message) {
  //   return reply.status(400).send({ error: 'Message is required' });
  // }

  // TODO: Send user message to the agent
  // const response = await agents[1].chat([{ role: 'user', content: message }]);
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
