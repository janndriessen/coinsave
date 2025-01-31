import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const account = searchParams.get("account");
  // TODO: get transactions from alchemy/covalent/...?
  return Response.json({ account, transactions: [] });
}
