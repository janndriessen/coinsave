import { customActionProvider, EvmWalletProvider } from "@coinbase/agentkit";
import { z } from "zod";


export const SignMessageSchema = z.object({
  message: z.string().describe("The message to sign. e.g. `hello world`"),
});

import { ActionProvider, WalletProvider, Network, CreateAction } from "@coinbase/agentkit";


class SignProvider extends ActionProvider<WalletProvider> {
    constructor() {
        super("my-action-provider", []);
    }

    @CreateAction({
        name: "sign",
        description: "Sign arbitrary messages using EIP-191 Signed Message Standard hashing",
        schema: SignMessageSchema,
    })

    async sign( walletProvider: EvmWalletProvider, args: z.infer<typeof SignMessageSchema>): Promise<string> {
        const { message } = args;
        const signature = await walletProvider.signMessage(message);
        return `The payload signature ${signature}`;
      }

    supportsNetwork = (network: Network) => true;
}

export const signer = () => new SignProvider();
