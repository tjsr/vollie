import { drizzle } from 'drizzle-orm/d1';
import { DEFAULT_ORGANISER } from '../src/config.js';
import { Events } from '../src/orm/drizzle/schema.js';

interface Env {
  VOLLIE_DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const db = drizzle(env.VOLLIE_DB);
    const result = await db.select().from(Events).all();
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

    return new Response(
      `Call /api/events to see everyone who works at ${DEFAULT_ORGANISER}`,
    );
  },
} satisfies ExportedHandler<Env>;

export const onRequest: PagesFunction<Env> = async (context: EventContext<Env, '' | 'gmbc', Record<string, unknown>>) => {
  const db = drizzle(context.env.VOLLIE_DB);
  const result = await db.select().from(Events).all();
  return Response.json(result);


  // const { results } = await context.env.VOLLIE_DB.prepare(
  //   "SELECT * FROM Events WHERE Organiser = ?",
  // )
  //   .bind(DEFAULT_ORGANISER)
  //   .all();
  // return Response.json(results);
};
