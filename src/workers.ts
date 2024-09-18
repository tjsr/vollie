import { DEFAULT_ORGANISER } from './config.js';
import { Env } from './types.js';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/events") {
      // If you did not use `DB` as your binding name, change it here
      const { results } = await env.VOLLIE_DB.prepare(
        "SELECT * FROM Events WHERE Organiser = ?",
      )
        .bind(DEFAULT_ORGANISER)
        .all();
      return Response.json(results);
    }

    return new Response(
      `Call /api/events to see everyone who works at ${DEFAULT_ORGANISER}`,
    );
  },
} satisfies ExportedHandler<Env>;