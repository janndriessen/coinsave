export async function PUT(req: Request) {
  const { account, inputAmount } = await req.json();
  // TODO: create/update dca action using the account and inputAmount
  return Response.json({ account, inputAmount });
}
