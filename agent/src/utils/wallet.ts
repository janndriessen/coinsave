import { CdpWalletProvider } from '@coinbase/agentkit';
import * as fs from 'fs';

export const WALLET_DATA_FILE = 'wallet_data.txt';

export async function configureWallet(): Promise<CdpWalletProvider> {
  let walletDataStr: string | null = null;

  // Read existing wallet data if available
  if (fs.existsSync(WALLET_DATA_FILE)) {
    console.log('exists');
    try {
      walletDataStr = fs.readFileSync(WALLET_DATA_FILE, 'utf8');
    } catch (error) {
      console.error('Error reading wallet data:', error);
      // Continue without wallet data
    }
  } else {
    const walletConfig = {
      apiKeyName: process.env.CDP_API_KEY_NAME,
      apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
        /\\n/g,
        '\n'
      ),
      cdpWalletData: walletDataStr || undefined,
      networkId: process.env.NETWORK_ID || 'base-sepolia',
    };
    const provider = await CdpWalletProvider.configureWithWallet(walletConfig);
    const exportedWallet = await provider.exportWallet();
    console.log(exportedWallet);
    fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));
  }

  // Configure CDP Wallet Provider
  const walletConfig = {
    apiKeyName: process.env.CDP_API_KEY_NAME,
    apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
      /\\n/g,
      '\n'
    ),
    cdpWalletData: walletDataStr || undefined,
    networkId: process.env.NETWORK_ID || 'base-sepolia',
  };

  return await CdpWalletProvider.configureWithWallet(walletConfig);
}
