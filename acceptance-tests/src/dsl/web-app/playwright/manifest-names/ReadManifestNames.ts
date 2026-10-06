import type {ManifestNames} from "@src/dsl/web-app/playwright/manifest-names/ManifestNames";

/** The names a manifest gives the app. What was fetched is `unknown` until checked: a name that is not text is left out. */
export function readManifestNames(manifest: unknown): ManifestNames {
  if (typeof manifest !== "object" || manifest === null) {
    return {};
  }

  const {name, short_name: shortName} = manifest as Record<string, unknown>;

  return {
    name: textOf(name),
    shortName: textOf(shortName),
  };
}

function textOf(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  return value;
}
