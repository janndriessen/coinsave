import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const account = searchParams.get("account");
  const res = await fetch(process.env.ALCHMEY_API_KEY!, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "content-type: application/json",
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: "0x0",
          toBlock: "latest",
          category: ["erc20"],
          order: "desc",
          withMetadata: true,
          excludeZeroValue: true,
          maxCount: "0x3e8",
          toAddress: account,
          contractAddresses: ["0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf"], // cbBTC
        },
      ],
    }),
  });
  const { result } = await res.json();
  const transactions = result.transfers.map((transfer: any) => {
    const timestamp = transfer.metadata.blockTimestamp;
    return {
      timestamp,
      amount: transfer.value.toString(),
      dateFormatted: timestamp.split("T")[0],
      timeFormatted: timestamp.split("T")[1].split(".")[0],
    };
  });
  return Response.json({ account, transactions });
}
