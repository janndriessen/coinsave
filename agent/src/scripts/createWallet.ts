import * as dotenv from 'dotenv';
import { validateEnvironment } from '../utils/config';
import { createWallet } from '../utils/wallet';

dotenv.config();
validateEnvironment();

async function main() {
  createWallet();
}

if (require.main === module) {
  console.log('Starting Agent...');
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
