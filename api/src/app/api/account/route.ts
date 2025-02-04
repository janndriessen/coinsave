export async function POST(req: Request) {
  const request = await req.json();
  console.log(request);
  // TODO: create/init agent(s)
  // TODO: return account address
  return Response.json({ message: "created", account: "0x0" });
}
