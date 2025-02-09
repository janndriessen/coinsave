import axios from 'axios';

export async function getCoinPrice(
  coin: string,
  currency: string = 'usd'
): Promise<number> {
  let price = undefined;
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids: coin,
          vs_currencies: currency,
        },
      }
    );
    const data: CoinGeckoResponse = response.data;
    console.log(
      `${coin.toUpperCase()} price in ${currency.toUpperCase()}:`,
      data[coin][currency]
    );
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
): Promise<number> {
  let averagePrice = undefined;
  try {
    const response = await axios.get<MarketChartResponse>(
      `https://api.coingecko.com/api/v3/coins/${coin}/market_chart`,
      {
        params: { vs_currency: currency, days: 7, interval: 'daily' }, // Get hour-level data
      }
    );

    const prices = response.data.prices.map(([_, price]) => price); // Extract prices
    averagePrice =
      prices.reduce((sum, price) => sum + price, 0) / prices.length;

    console.log(
      `7-day average price of ${coin.toUpperCase()} in ${currency.toUpperCase()}:`,
      averagePrice.toFixed(2)
    );
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
