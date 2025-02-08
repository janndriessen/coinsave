import { ChatMessage, FunctionMessage, HumanMessage } from "@langchain/core/messages";
import * as readline from "readline";
import { Agent, Config } from "../utils/types";
import { chooseModel } from "./chooseModel";

export async function runAgents(_priceAgent: Agent, _walletAgent: Agent) {
  console.log("Starting chat mode... Type 'exit' to end.");

  const shouldBuyBitcoin = await buyOrNotToBuy(_priceAgent);

  if (shouldBuyBitcoin) {
    console.log("Buying Bitcoin ....");
    await buyBitcoin(_walletAgent);
  } else {
    console.log("Not buying Bitcoin today ...");

  }

}
async function buyBitcoin(_walletAgent: Agent) {
  const { agent: walletAgent, config: walletAgentConfig } = _walletAgent;
  const buyQuestion = `Please swap 0.5 dollar worth of eth balance for cbBTC. Note that that ETH is around 2'600 USD and
  cbBTC is around 96'000 USD so you should swap around 0.0002 ETH for around 0,000005 cbBTC. But just take this as a reference
  poind and check the current price of cbBTC and ETH before you make the swap. Please further print the transaction receipt to 
  the console.`;

  const stream = await walletAgent.stream({ messages: [new HumanMessage(buyQuestion)] }, walletAgentConfig);

  for await (const chunk of stream) {
    if ("agent" in chunk) {
      console.log(chunk.agent.messages[0].content);
    } else if ("tools" in chunk) {
      console.log(chunk.tools.messages[0].content);
    }
    console.log("-------------------");
  }

}

async function buyOrNotToBuy(_priceAgent: Agent): Promise<boolean> {
  const { agent: priceAgent, config: priceAgentConfig } = _priceAgent;

  const priceQuestion = "Should i buy bitcoin?";
  const stream = await priceAgent.stream({ messages: [new HumanMessage(priceQuestion)] }, priceAgentConfig);

  let buyBitcoin: boolean = false;
  for await (const chunk of stream) {

    if ("agent" in chunk) {
      const message = chunk.agent.messages[0].content;


      try {
        const messageAsString = message.toString().toLowerCase();

        console.log("Message: ", messageAsString);
        if (/yes/.test(messageAsString)) {
          buyBitcoin = true;
        } else if (/no/.test(messageAsString)) {
          buyBitcoin = false;
        } else {
          console.error(messageAsString, "is not a valid response");
        }
      } catch {
        console.error("Error parsing message");
      }
    }

    console.log("Buy Bitcoin: ", buyBitcoin);
  }
  return buyBitcoin;
}