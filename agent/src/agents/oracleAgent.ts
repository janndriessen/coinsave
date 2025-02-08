import {
  AgentKit,
  CdpWalletProvider,
  wethActionProvider,
  walletActionProvider,
  erc20ActionProvider,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  pythActionProvider,
} from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { Agent } from "../utils/types";


export async function initializeOracleAgent(): Promise<Agent> {
  // Initialize LLM
  const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
  });

  // Initialize AgentKit
  const agentkit = await AgentKit.from({
    actionProviders: [
      wethActionProvider(),
      pythActionProvider(),
      walletActionProvider(),
      erc20ActionProvider(),
      cdpApiActionProvider({
        apiKeyName: process.env.CDP_API_KEY_NAME,
        apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
      cdpWalletActionProvider({
        apiKeyName: process.env.CDP_API_KEY_NAME,
        apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    ],
  });


  const tools = [... await getLangChainTools(agentkit)];

  // Store buffered conversation history in memory
  const memory = new MemorySaver();
  const config = { configurable: { thread_id: "Price Agent" } };


  // Create React Agent using the LLM and CDP AgentKit tools
  const agent = createReactAgent({
    llm,
    tools: tools,
    checkpointSaver: memory,
    messageModifier: `
          You are a helpful agent that tells me wether to to buy bitcoin. Whatever I ask you, you should answer with a "yes" or "no".
          If you dont know the answer, you must give a random reponse. Any other reponse is not allowed.
          `,
  });


  return { agent, config };
}
