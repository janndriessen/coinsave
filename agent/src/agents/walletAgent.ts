import {
  AgentKit,
  CdpWalletProvider,
  wethActionProvider,
  walletActionProvider,
  erc20ActionProvider,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  pythActionProvider,
} from '@coinbase/agentkit';
import { getLangChainTools } from '@coinbase/agentkit-langchain';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';
import { Agent } from '../utils/types';
import { basescan } from '../actions/basescan';

export async function initializeWalletAgent(
  walletProvider: CdpWalletProvider
): Promise<Agent> {
  // Initialize LLM
  const llm = new ChatOpenAI({
    model: 'gpt-4o-mini',
  });

  // Initialize AgentKit
  const agentkit = await AgentKit.from({
    walletProvider,
    actionProviders: [
      wethActionProvider(),
      pythActionProvider(),
      walletActionProvider(),
      erc20ActionProvider(),
      cdpApiActionProvider({
        apiKeyName: process.env.CDP_API_KEY_NAME,
        apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
          /\\n/g,
          '\n'
        ),
      }),
      cdpWalletActionProvider({
        apiKeyName: process.env.CDP_API_KEY_NAME,
        apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
          /\\n/g,
          '\n'
        ),
      }),
      basescan(),
    ],
  });

  const tools = [...(await getLangChainTools(agentkit))];

  // Store buffered conversation history in memory
  const memory = new MemorySaver();
  const config = {
    configurable: { thread_id: 'Agent with on-chain capabilities' },
  };

  // Create React Agent using the LLM and CDP AgentKit tools
  const agent = createReactAgent({
    llm,
    tools: tools,
    checkpointSaver: memory,
    messageModifier: `
          You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are 
          empowered to interact onchain using your tools. Before executing your first action, get the wallet details to see what network 
          you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone 
          asks you to do something you can't do with your currently available tools, you must say so, and 
          encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to 
          docs.cdp.coinbase.com for more information. Be concise and helpful with your responses. Refrain from 
          restating your tools' descriptions unless it is explicitly requested.
          `,
  });

  return { agent, config };
}
