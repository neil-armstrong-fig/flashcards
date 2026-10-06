import {RateLimit} from "alchemy/cloudflare";

/**
 * Speech requests, counted by the address they come from: twenty a minute. The namespace id and the numbers must match
 * `api/wrangler.jsonc`, which declares the same counter for `wrangler dev` alone.
 */
export function buildSpeechLimiter(): RateLimit {
  return RateLimit({namespace_id: 2001, simple: {limit: 20, period: 60}});
}
