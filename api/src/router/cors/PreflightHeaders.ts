/** The headers of the answer to a preflight: the CORS headers already worked out, with what the app is allowed to send. */
export function preflightHeaders(cors: Headers): Headers {
  const headers = new Headers(cors);

  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  headers.set("Access-Control-Max-Age", "7200");

  return headers;
}
