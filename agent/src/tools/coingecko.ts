import axios from 'axios';

export async function getCoinPrice(
  coin: string,
  currency: string = 'usd'
): Promise<number | undefined> {
  let price = undefined;

  const apiKey = process.env.COINGECKO_API_KEY;
  if (!apiKey) {
    throw new Error('Missing COINGECKO_API_KEY environment variable');
  }

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids: coin,
          vs_currencies: currency,
        },
        headers: {
          'x-cg-demo-api-key': apiKey,
        },
      }
    );
    const data: CoinGeckoResponse = response.data;

    price = data[coin][currency];
  } catch (error: any) {
    console.error(
      'Error fetching price:',
      error.response?.data || error.message
    );
  }

  if (price === undefined) {
    throw new Error('Error fetching price');
  }
  return price;
}

interface CoinGeckoResponse {
  [key: string]: {
    [currency: string]: number;
  };
}

export async function get7DayAveragePrice(
  coin: string = 'bitcoin',
  currency: string = 'usd'
): Promise<number | undefined> {
  let averagePrice = undefined;
  const apiKey = process.env.COINGECKO_API_KEY;
  if (!apiKey) {
    throw new Error('Missing COINGECKO_API_KEY environment variable');
  }
  try {
    const response = await axios.get<MarketChartResponse>(
      `https://api.coingecko.com/api/v3/coins/${coin}/market_chart`,
      {
        params: { vs_currency: currency, days: 7, interval: 'daily' }, // Get hour-level data
        headers: {
          'x-cg-demo-api-key': apiKey,
        },
      }
    );

    const prices = response.data.prices.map(([_, price]) => price); // Extract prices
    averagePrice =
      prices.reduce((sum, price) => sum + price, 0) / prices.length;
  } catch (error: any) {
    console.error(
      'Error fetching 7-day average price:',
      error.response?.data || error.message
    );
  }
  if (averagePrice === undefined) {
    throw new Error('Error fetching 7-day average price');
  }
  return averagePrice;
}

interface MarketChartResponse {
  prices: [number, number][]; // Array of [timestamp, price] pairs
}

interface PriceAnalysis {
  currentPrice: number | undefined;
  averagePrice: number | undefined;
  percentageDifference: number | undefined;
  summary: string;
}

export async function analyzePriceComparison(
  coin: string = 'bitcoin',
  currency: string = 'usd'
): Promise<PriceAnalysis> {
  const currentPrice = await getCoinPrice(coin, currency);
  const averagePrice = await get7DayAveragePrice(coin, currency);

  let summary, percentageDifference;
  if (currentPrice === undefined || averagePrice === undefined) {
    summary = 'Error fetching price data';
    percentageDifference = undefined;
  } else {
    percentageDifference = ((currentPrice - averagePrice) / averagePrice) * 100;

    summary = `The current price of ${coin.toUpperCase()} (${currentPrice.toFixed(2)} ${currency.toUpperCase()}) is `;
    if (percentageDifference > 5) {
      summary += `significantly higher than the 7-day average of ${averagePrice.toFixed(2)} ${currency.toUpperCase()} (+${percentageDifference.toFixed(2)}%). This might indicate a strong upward trend.`;
    } else if (percentageDifference < -5) {
      summary += `significantly lower than the 7-day average of ${averagePrice.toFixed(2)} ${currency.toUpperCase()} (${percentageDifference.toFixed(2)}%). This might present a buying opportunity.`;
    } else {
      summary += `close to the 7-day average of ${averagePrice.toFixed(2)} ${currency.toUpperCase()} (${percentageDifference.toFixed(2)}%). The market appears relatively stable.`;
    }
  }
  return {
    currentPrice,
    averagePrice,
    percentageDifference,
    summary,
  };
}
