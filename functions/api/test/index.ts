import { Env } from "../../../src/types";

export const onRequest = (context: EventContext<Env, string, Record<string, unknown>>) => {
  console.log('test/index.ts', context.functionPath, onRequest, context.request.url);
  return new Response(`test/index.ts onRequest url=${context.request.url}`);
};

export const onRequestPost = (context: EventContext<Env, string, Record<string, unknown>>) => {
  console.log('test/index.ts', context.functionPath, onRequestPost, context.request.url);
  return context.next(context.request);
  // return new Response(`test/index.ts onRequestGet url=${context.request.url}`);
};
