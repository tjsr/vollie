import { selectEvents } from '../../src/orm/event.js';
import { VollieDrizzleConnection } from '../../src/types.js';
import { getDbConnectionFromEnv } from '../../src/orm/index.js';
import { Env, notAllowedMethodHandler } from '../../src/functionUtils.js';

export default {
  async fetch(_request: Request, env: Env): Promise<Response> {
    console.warn("Called from fetch() which we don't expect to ever run!'");

    const db: VollieDrizzleConnection = getDbConnectionFromEnv(env);
    const result = await selectEvents(db);

    // const result = await db.select({ events: RaceEventsTable, series: SeriesTable, organiser: OrganisersTable }).from(RaceEventsTable).all();
    // const result = await db.select().from(Events).all();
    return Response.json(result);

    // const { pathname } = new URL(request.url);

    // if (pathname === "/api/events") {
    //   // If you did not use `DB` as your binding name, change it here
    //   const { results } = await env.VOLLIE_DB.prepare(
    //     "SELECT * FROM Events WHERE Organiser = ?",
    //   )
    //     .bind(DEFAULT_ORGANISER)
    //     .all();
    //   return Response.json(results);
    // }

    // return new Response(
    //   `Call /api/events to see everyone who works at ${DEFAULT_ORGANISER}`,
    // );
  },
} satisfies ExportedHandler<Env>;

export const onRequest: PagesFunction<Env> = async (context: EventContext<Env, 'never', Record<string, unknown>>) => {
  console.log('/events entrypoint: ', context.request.url, context.request.method, context.request.headers.get('content-type'));
  const db: VollieDrizzleConnection = getDbConnectionFromEnv(context.env);
  if (context.request.method === 'POST') {
    return notAllowedMethodHandler(context);
  }

  // const tables = await context.env.VOLLIE_DB.prepare(`PRAGMA table_list`).all();
  // console.log(tables);
  
  // db.execute(sql`.tables`);
  const result = await selectEvents(db);
  console.log('events/onRequest called with GET');
  return Response.json(result);
};
