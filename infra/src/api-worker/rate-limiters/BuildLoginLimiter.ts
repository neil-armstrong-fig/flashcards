import {RateLimit} from "alchemy/cloudflare";

/** Sign-in attempts, counted by the address they come from: ten a minute. The namespace id and the numbers must match `api/wrangler.jsonc`. */
export function buildLoginLimiter(): RateLimit {
  return RateLimit({namespace_id: 2002, simple: {limit: 10, period: 60}});
}
