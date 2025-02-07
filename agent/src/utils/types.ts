import { createReactAgent } from "@langchain/langgraph/prebuilt";

export interface ChatBot {
  agent: ReturnTypeOfReatReactAgent;
  config: Config;
}
export interface Config {
  configurable: {
    thread_id: string;
  };
}

type ReturnTypeOfReatReactAgent = ReturnType<typeof createReactAgent>;
