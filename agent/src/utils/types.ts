import { createReactAgent } from "@langchain/langgraph/prebuilt";

export interface InitializationResult {
  agent: ReturnTypeOfReatReactAgent;
  config: Config;
}
export interface Config {
  configurable: {
    thread_id: string;
  };
}

type ReturnTypeOfReatReactAgent = ReturnType<typeof createReactAgent>;
