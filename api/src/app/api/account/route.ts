import { AGENT_WALLET } from "@/app/constants";

export async function POST() {
  // TODO: create/deploy/init agents
  // There is plenty of services where the agents could be deployed. It's not
  // important to proof our concept here, so we're just returning our demo account.
  return Response.json({ message: "created", account: AGENT_WALLET });
}
