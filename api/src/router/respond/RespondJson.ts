/** An answer that is some JSON. */
export function respondJson(body: unknown, status = 200): Response {
  return Response.json(body, {status});
}
