interface Environment {
  readonly DEPLOYED_API_ORIGIN: string;
}

/**
 * Keeps the browser on localhost while forwarding API requests to the deployed Worker, so its `SameSite=Lax` cookies work in the
 * same way as they do between the ordinary local app and API.
 */
export default {
  async fetch(request: Request, environment: Environment): Promise<Response> {
    const requestUrl = new URL(request.url);

    if (!requestUrl.pathname.startsWith("/api/")) {
      return new Response(null, {status: 404});
    }

    const upstreamUrl = new URL(`${requestUrl.pathname}${requestUrl.search}`, environment.DEPLOYED_API_ORIGIN);

    return await fetch(new Request(upstreamUrl, request));
  },
} satisfies ExportedHandler<Environment>;
