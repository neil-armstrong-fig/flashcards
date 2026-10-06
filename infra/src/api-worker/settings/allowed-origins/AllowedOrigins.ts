const LOCAL_APP_ORIGIN = "http://localhost:3000";

/** The configured app origins plus the local app, which can reach a deployed API through its local proxy. */
export function allowedOrigins(configured?: string): string {
  if (configured === undefined || configured === "") {
    return LOCAL_APP_ORIGIN;
  }

  const origins = configured.split(",").map(origin => origin.trim());

  if (origins.includes(LOCAL_APP_ORIGIN)) {
    return configured;
  }

  return `${configured},${LOCAL_APP_ORIGIN}`;
}
