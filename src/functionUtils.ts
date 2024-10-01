import { Existing, TransferObject, Uninitialised } from "./model/to";

import { IdType } from "./model/id";
import { VollieDrizzleConnection } from "./types";
import { WithId } from "./orm/drizzle/idTypes";

export interface Env {
  VOLLIE_DB: D1Database;
}

export type CreateFunction<
TO,
NewTO extends Uninitialised<TO> = Uninitialised<TO>,
ExistingTO extends Existing<TO> = Existing<TO>
> = (db: VollieDrizzleConnection, to: NewTO) => Promise<ExistingTO>;
export type UpdateFunction<TO extends TransferObject<unknown>, ID extends IdType> = (db: VollieDrizzleConnection, to: TO) => Promise<ID>;
export type BodyValidateFunction<TO extends TransferObject<unknown, ID>, ID extends IdType> = (body: Record<string, unknown>) => ValidatedTOs<TO, ID>;

// type InferNewTO<NewTO> = NewTO extends Uninitialised<infer TO> ? TO : never;
// type IdValidateFunction<ID extends IdType> = (idParam: string | string[],raw: boolean) => T;
// type InferValidatedTO<T, ID extends IdType> = T extends BodyValidateFunction<infer TO, ID> ? TO : never;
// type InferTO<T, ID extends IdType> = T extends BodyValidateFunction<infer TO, ID> ? TO : never;

export type ValidatedTOs<TO, ID extends IdType> = {
  created?: Uninitialised<TO>;
  updated?: Existing<TO, ID>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const onHtmlRequest: PagesFunction<Env> = async (context: EventContext<Env, '', Record<string, unknown>>) => {
  console.log(`Returning empty html from ${context.request.url} for ${context.request.method}/${context.request.headers.get('content-type')}`);
  return new Response(`<!doctype html>
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vollie</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
`, {
    headers: {
      // 'content-type': 'text/plain;charset=UTF-8',
      'content-type': 'text/html;charset=UTF-8',
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const notYetImplementedRequestHandler = async (_context: EventContext<Env, string, Record<string, unknown>>) => {
  return new Response('Not yet implemented', { status: 501 });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const notAllowedMethodHandler = async (_context: EventContext<Env, string, Record<string, unknown>>) => {
  return new Response('Method Not Allowed', { status: 405 });
};

export const resultForModelObject = <O extends WithId<IdType, unknown>>(context: EventContext<Env, string, unknown>, result: O | undefined) => {
  if (!result) {
    console.log(`Not found while retrieving ${context.request.url}`);
    return new Response('Not found', { status: 404, headers: { 'Content-Type': 'application/json' } });
  }
  return Response.json(result);
};
