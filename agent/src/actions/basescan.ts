import { customActionProvider, EvmWalletProvider } from '@coinbase/agentkit';
import { z } from 'zod';
import axios from 'axios';
import { formatUnits, parseUnits } from 'viem';

interface Log {
  address: string;
  topics: string[];
  data: string;
  blockNumber: string;
  blockHash: string;
  timeStamp: string;
  gasPrice: string;
  gasUsed: string;
  logIndex: string;
  transactionHash: string;
  transactionIndex: string;
}

interface ApiResponse {
  status: string;
  message: string;
  result: Log[];
}

export const BaseScanMessageSchema = z.object({
  message: z
    .string()
    .describe(
      'The start time of the query as timestamp in seconds e.g. `1739008123`'
    ),
});

import {
  ActionProvider,
  WalletProvider,
  Network,
  CreateAction,
} from '@coinbase/agentkit';
import { cbBTC_ADDRESS } from '../utils/constant';

const transferEventSignature =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

class BasescanProvider extends ActionProvider<WalletProvider> {
  constructor() {
    super('my-action-provider', []);
  }
  @CreateAction({
    name: 'get_btc_transferred',
    description:
      'Get all bitcoin transferred to my account as number with 8 decimal places',
    schema: BaseScanMessageSchema,
  })
  async get_btc_transferred(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof BaseScanMessageSchema>
  ): Promise<string | undefined> {
    const { message } = args;
    const userAddress = walletProvider.getAddress();

    const startTime = parseInt(message);
    const endTime = Math.floor(Date.now() / 1000) + 1; // current time in seconds

    const fromBlock = '1844947';
    const toBlock = 'latest';
    const toAddress = `0x000000000000000000000000${userAddress.slice(2)}`;
    // TODO: filter by fromAddress by "coinbase"
    const page = 1;
    const offset = 1000;

    const apiKey = process.env.BASESCAN_API_KEY || undefined;

    if (!apiKey) {
      console.error('Missing BASESCAN_API_KEY');
    }

    const url = `https://api.basescan.org/api?module=logs&action=getLogs&fromBlock=${fromBlock}&toBlock=${toBlock}&address=${cbBTC_ADDRESS}&topic0=${transferEventSignature}&topic0_2_opr=and&topic2=${toAddress}&page=${page}&offset=${offset}&apikey=${apiKey}`;

    console.log('Fetching logs from:', url);
    let amountBought = BigInt(0);
    try {
      const response = await axios.get(url);
      const data: ApiResponse = response.data;

      if (data.status === '1' && data.message === 'OK') {
        for (const log of data.result) {
          const timeStamp = parseInt(log.timeStamp, 16);

          if (timeStamp >= startTime && timeStamp <= endTime) {
            const valueAsBigInt = BigInt(log.data);
            console.log('Amount bought:', valueAsBigInt.toString());
            amountBought += valueAsBigInt;
          }
        }
      } else {
        console.error('Error fetching logs:', data.message);
      }

      return formatUnits(amountBought, 8);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  }

  supportsNetwork = (network: Network) => network.chainId === '8453';
}

export const basescan = () => new BasescanProvider();
