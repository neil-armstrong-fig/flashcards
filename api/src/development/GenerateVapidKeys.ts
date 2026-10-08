import {generateKeyPairSync} from "node:crypto";

/**
 * Makes the key pair the reminders' pushes are signed with (VAPID, RFC 8292) and prints it as the three names the Worker reads, for the
 * developer to put in the root `.env.dev` by hand: `pnpm --filter @flashcards/api vapid-keys`. Run it once; a new pair makes every
 * device's subscription useless until it turns the reminder off and on again. The private key is shown once, in the terminal: it is
 * never stored by this script, and never goes in a chat, a document or a commit.
 */
const pair = generateKeyPairSync("ec", {namedCurve: "prime256v1"});
const {x = "", y = ""} = pair.publicKey.export({format: "jwk"});
const {d = ""} = pair.privateKey.export({format: "jwk"});
const point = Buffer.concat([Buffer.from([4]), Buffer.from(x, "base64url"), Buffer.from(y, "base64url")]);

process.stdout.write(
  [
    `VAPID_PUBLIC_KEY=${point.toString("base64url")}`,
    `VAPID_PRIVATE_KEY=${d}`,
    "VAPID_SUBJECT=mailto:<an address a push service could write to>",
    "",
  ].join("\n"),
);
