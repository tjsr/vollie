export { onRequest } from "./index";

// export const onIdRequest: PagesFunction<Env> = async (context: EventContext<Env, string | 'new', Record<string, unknown>>) => {
//   if (context.request.method !== 'GET' && context.request.headers.get('content-type') !== 'application/json') {
//     console.warn('Rejected: /api/organisation/:organisationId entrypoint:', context.params.organisationId, context.request.url, context.request.method, context.request.headers.get('content-type'));
//     return notAllowedMethodHandler(context);
//   }
//   console.log('/api/organisation/:organisationId entrypoint:', context.params.eventId, context.request.url, context.request.method, context.request.headers.get('content-type'));

//   return indexRequest(context);
// };
