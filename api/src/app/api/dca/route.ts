export async function PUT(req: Request) {
  const { account, inputAmount } = await req.json();
  console.log("update DCA config for:", account, inputAmount);
  // Do not await as agents would not close connection.
  fetch("http://127.0.0.1:3000/update-dca", {
    method: "PUT",
    body: JSON.stringify({
      account,
      amountPerEpoch: inputAmount, // in USD
      interval: 30,
      epochLenght: 60 * 60 * 24,
    }),
  });
  return Response.json({ account, inputAmount });
}
