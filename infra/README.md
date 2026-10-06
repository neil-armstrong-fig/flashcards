# infra

The API's Cloudflare resources as code (Alchemy): the D1 database, the KV namespaces, the R2 bucket and the Worker. `pnpm --filter @language-learning/infra provision` creates or adopts them by name; `destroy` removes them.

Imports no other package: it names the Worker's entry file by path. See [AGENTS.md](AGENTS.md).
