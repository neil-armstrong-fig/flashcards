import deployedApiProxy from "@src/development/DeployedApiProxy";

const environment = {DEPLOYED_API_ORIGIN: "https://flashcards-api.neilarmstrong.dev"};

afterEach(() => {
  vi.unstubAllGlobals();
});

it("forwards an API request and its response through localhost", async () => {
  let forwarded: Request | undefined;
  const responseHeaders = new Headers();
  responseHeaders.append("Set-Cookie", "session=token; Path=/; HttpOnly");
  responseHeaders.append("Set-Cookie", "oauth=; Path=/api/auth/google; Max-Age=0");
  vi.stubGlobal("fetch", async (request: Request): Promise<Response> => {
    forwarded = request;

    return new Response("kept", {status: 201, headers: responseHeaders});
  });

  const response = await deployedApiProxy.fetch(
    new Request("http://localhost:8787/api/notes?deck=ko-starter", {
      method: "POST",
      headers: {Cookie: "session=token", Origin: "http://localhost:3000"},
      body: '{"word":"고래"}',
    }),
    environment,
  );

  expect(forwarded).toBeDefined();
  if (forwarded === undefined) {
    throw new Error("The deployed API was not asked.");
  }

  expect(forwarded.url).toBe("https://flashcards-api.neilarmstrong.dev/api/notes?deck=ko-starter");
  expect(forwarded.method).toBe("POST");
  expect(forwarded.headers.get("Cookie")).toBe("session=token");
  expect(forwarded.headers.get("Origin")).toBe("http://localhost:3000");
  expect(await forwarded.text()).toBe('{"word":"고래"}');
  expect(response.status).toBe(201);
  expect(await response.text()).toBe("kept");
  expect(response.headers.getSetCookie()).toEqual([
    "session=token; Path=/; HttpOnly",
    "oauth=; Path=/api/auth/google; Max-Age=0",
  ]);
});

it("does not proxy anything outside the API", async () => {
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);

  const response = await deployedApiProxy.fetch(new Request("http://localhost:8787/private"), environment);

  expect(response.status).toBe(404);
  expect(fetch).not.toHaveBeenCalled();
});
