import type { NextRequest } from "next/server";
import { createPublicClient, http, isAddress, parseAbi } from "viem";
import { base } from "viem/chains";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const account = searchParams.get("account");
  if (!account || !isAddress(account)) {
    return Response.json({ error: "invalid account address" }, { status: 400 });
  }
  const client = createPublicClient({
    chain: base,
    transport: http(process.env.ALCHMEY_API_KEY),
  });
  const data = await client.readContract({
    address: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf", // cbBTC
    abi: parseAbi(["function balanceOf(address owner) view returns (uint256)"]),
    functionName: "balanceOf",
    args: [account],
  });
  return Response.json({
    account,
    symbol: "cbBTC",
    decimals: 8,
    balance: data.toString(),
  });
}
