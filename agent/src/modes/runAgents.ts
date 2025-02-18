import { HumanMessage } from '@langchain/core/messages';

import { Agent } from '../utils/types';
import {
  analyzePriceComparison,
  getCoinPrice,
} from '../tools/coingecko';
import { getFeeComparison } from '../tools/blockchative';
import { cbBTC_ADDRESS, MIN_BUY_AMOUNT_USD } from '../utils/constant';

const SECONDS_PER_MONTH = 60 * 60 * 24 * 30;

export async function runAgentsInAutonomousMode(
  _oracleAgent: Agent,
  _walletAgent: Agent,
  amountPerEpoch: number,
  epochLength: number,
  interval: number
) {
  console.log('Starting autonomous mode...');

  while (true) {
    try {
      await runAgents(_oracleAgent, _walletAgent, amountPerEpoch, epochLength);
      const timeout = interval * 1000; // Convert interval to seconds
      await new Promise((resolve) => setTimeout(resolve, timeout));
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
      process.exit(1);
    }
  }
}

export async function runAgents(
  _oracleAgent: Agent,
  _walletAgent: Agent,
  amountPerEpoch: number = 1,
  epochLength: number = SECONDS_PER_MONTH
) {
  console.log("Starting chat mode... Type 'exit' to end.");

  const shouldBuyBitcoin = await buyOrNotToBuy(_oracleAgent);
  console.log('Should buy Bitcoin: ', shouldBuyBitcoin);

  // query amount bought amount target;
  if (shouldBuyBitcoin) {
    const bitcoinAmountInUSD = await buyAmount(
      _walletAgent,
      amountPerEpoch,
      epochLength
    );
    console.log(`Buying ${bitcoinAmountInUSD} Bitcoin in USD ....`);

    if (bitcoinAmountInUSD > MIN_BUY_AMOUNT_USD) {
      await buyBitcoin(_walletAgent, bitcoinAmountInUSD);
      console.log('Bought some Bitcoin ...');
    } else {
      console.log('Not enough funds to buy Bitcoin ...');
    }
  } else {
    console.log('Not buying Bitcoin ...');
  }
}

async function buyBitcoin(_walletAgent: Agent, amount: number) {
  const { agent: walletAgent, config: walletAgentConfig } = _walletAgent;
  const btc_usd = (await getCoinPrice('bitcoin')) ?? 96000;
  const eth_usd = (await getCoinPrice('ethereum')) ?? 2600;

  const amountToBuyInEth = amount / eth_usd;
  const amountToBuyInCbtc = amount / btc_usd;

  const buyQuestion = `Please swap ${amount} worth of ETH for cbBTC. cbBTC has the token address ${cbBTC_ADDRESS} on the base mainnet network and is roughl pegged to the price of BTC
  which price you know. Note that that ETH is around ${eth_usd} USD and cbBTC is around ${btc_usd} USD so you should swap around ${amountToBuyInEth} ETH for around ${amountToBuyInCbtc} cbBTC. 
  But just take this as a reference and accept the price quoted by the exchange. Please further print the transaction receipt to the console.`;

  const stream = await walletAgent.stream(
    { messages: [new HumanMessage(buyQuestion)] },
    walletAgentConfig
  );

  for await (const chunk of stream) {
    if ('agent' in chunk) {
      console.log(chunk.agent.messages[0].content);
    } else if ('tools' in chunk) {
      console.log(chunk.tools.messages[0].content);
    }
    console.log('-------------------');
  }
}

async function buyOrNotToBuy(_oracleAgent: Agent): Promise<boolean> {
  const { agent: oracleAgent, config: oracleAgentConfig } = _oracleAgent;

  const priceAnalysis = await analyzePriceComparison('bitcoin');
  const gasPriceAnlysis = await getFeeComparison();

  const priceQuestion = `Should i buy bitcoin. yes or no. Take into consideration this price analysis ${priceAnalysis} this gas price analysis ${gasPriceAnlysis}`;
  const stream = await oracleAgent.stream(
    { messages: [new HumanMessage(priceQuestion)] },
    oracleAgentConfig
  );

  let buyBitcoin: boolean = false;
  for await (const chunk of stream) {
    if ('agent' in chunk) {
      const message = chunk.agent.messages[0].content;

      try {
        const messageAsString = message.toString().toLowerCase();

        console.log('Message: ', messageAsString);
        if (/yes/.test(messageAsString)) {
          buyBitcoin = true;
        } else if (/no/.test(messageAsString)) {
          buyBitcoin = false;
        } else {
          console.error(messageAsString, 'is not a valid response');
        }
      } catch {
        console.error('Error parsing message');
      }
    }

    console.log('Buy Bitcoin: ', buyBitcoin);
  }
  return buyBitcoin;
}

async function buyAmount(
  _walletAgent: Agent,
  amountPerEpoch: number,
  epochLength: number
): Promise<number> {
  const { agent: walletAgent, config: walletAgentConfig } = _walletAgent;

  const today = new Date();
  const currentTimeInSeconds = Math.floor(today.getTime() / 1000);
  const epochStartInSeconds =
    Math.floor(currentTimeInSeconds / epochLength) * epochLength;

  const priceQuestion = `get me the amount of cbtc i have bought since timestamp ${epochStartInSeconds} and covert this amount to a dollar value and return the following 
    format to me 'USD_AMOUNT_DCA=$AMOUNT', e.g. when the amount is 1000 USD the output should be 'USD_AMOUNT_DCA=1000'`;
  const stream = await walletAgent.stream(
    { messages: [new HumanMessage(priceQuestion)] },
    walletAgentConfig
  );

  let buyAmount: number = 0;

  const regex = /USD_AMOUNT_DCA=(\d+\.\d+)/;

  for await (const chunk of stream) {
    if ('agent' in chunk) {
      const message = chunk.agent.messages[0].content;

      try {
        const messageAsString = message.toString();

        const match = messageAsString.match(regex);
        if (match) {
          const extractedNumber = parseFloat(match[1]);
          console.log('Extracted Number: ', extractedNumber);
          buyAmount = extractedNumber;
        }
      } catch {
        console.error('Error parsing message');
      }
    }
  }

  const targetAmount =
    (amountPerEpoch * (currentTimeInSeconds - epochStartInSeconds)) /
    epochLength;

  const amountToBuy = targetAmount < buyAmount ? 0 : targetAmount - buyAmount;

  return amountToBuy;
}
