import { DallEAPIWrapper } from '@langchain/openai';

// add dallE
export const dallETool = new DallEAPIWrapper({
  n: 1,
  model: 'dall-e-3',
  apiKey: process.env.OPENAI_API_KEY,
});

/* Integrate as

import { dallETool } from "./agents/chatbot";
const tools = await getLangChainTools(agentkit);

const allTools = [...tools, dallETool];
*/
