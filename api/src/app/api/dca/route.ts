export async function PUT(req: Request) {
  const { account, inputAmount } = await req.json();
  // Do not await as agents would not close connection.
  fetch("http://127.0.0.1:3000/update-dca", {
    method: "PUT",
    body: JSON.stringify({ account, inputAmount }),
  });
  return Response.json({ account, inputAmount });
}
