import axios from 'axios';

interface BlockPrice {
  blockNumber: number;
  baseFeePerGas: number;
}

interface BlockNativeResponse {
  blockPrices: BlockPrice[];
}

interface FeeStats {
  currentBaseFee: number;
  averageBaseFee: number;
  averageDeviation: number;
}

async function fetchCurrentGasPrices(
  apiKey: string,
  chainId: number
): Promise<BlockPrice> {
  const url = `https://api.blocknative.com/gasprices/blockprices?chainid=${chainId}`;
  const response = await axios.get<BlockNativeResponse>(url, {
    headers: { Authorization: apiKey },
  });
  return response.data.blockPrices[0];
}

async function fetchHistoricalGasPrices(
  apiKey: string,
  chainId: number,
  startDate: string,
  endDate: string
): Promise<BlockPrice[]> {
  const url = `https://api.blocknative.com/gasprices/blockprices?chainid=${chainId}&start=${startDate}&end=${endDate}`;
  const response = await axios.get<BlockNativeResponse>(url, {
    headers: { Authorization: apiKey },
  });
  return response.data.blockPrices;
}

function calculateFeeStats(
  currentGas: BlockPrice,
  historicalGas: BlockPrice[]
): FeeStats {
  const currentBaseFee = currentGas.baseFeePerGas;
  const count = historicalGas.length;
  const totalBaseFee = historicalGas.reduce(
    (sum, block) => sum + block.baseFeePerGas,
    0
  );
  const averageBaseFee = totalBaseFee / count;

  const totalDeviation = historicalGas.reduce((sum, block) => {
    return sum + Math.abs(currentBaseFee - block.baseFeePerGas);
  }, 0);

  return {
    currentBaseFee,
    averageBaseFee,
    averageDeviation: totalDeviation / count,
  };
}

function generateStateDescription(stats: FeeStats): string {
  if (stats.currentBaseFee < stats.averageBaseFee) {
    return 'The current base fee is lower than the average fee over the past 7 days, which is a good sign for transactions.';
  }
  if (stats.currentBaseFee > stats.averageBaseFee) {
    return 'The current base fee is higher than the average fee over the past 7 days. Consider waiting for lower fees.';
  }
  return 'The current base fee is about the same as the average fee over the past 7 days.';
}

export async function getFeeComparison(
  chainId: number = 8453
): Promise<string> {
  const apiKey = process.env.BLOCKNATIVE_API_KEY;
  if (!apiKey) {
    throw new Error('Missing BLOCKNATIVE_API_KEY');
  }

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date();

    // Sequential API calls
    const currentGas = await fetchCurrentGasPrices(apiKey, chainId);

    const historicalGas = await fetchHistoricalGasPrices(
      apiKey,
      chainId,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    const stats = calculateFeeStats(currentGas, historicalGas);

    return generateStateDescription(stats);
  } catch (error) {
    console.error('Error in getFeeComparison:', error);
    throw error;
  }
}
