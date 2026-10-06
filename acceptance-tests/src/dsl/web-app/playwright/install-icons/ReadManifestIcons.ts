import type {ManifestIcon} from "@src/dsl/web-app/playwright/install-icons/ManifestIcon";

/** The icons a manifest lists. What was fetched is `unknown` until checked: anything that is not a complete icon is left out. */
export function readManifestIcons(manifest: unknown): ManifestIcon[] {
  if (typeof manifest !== "object" || manifest === null || !("icons" in manifest) || !Array.isArray(manifest.icons)) {
    return [];
  }

  const icons: ManifestIcon[] = [];

  for (const icon of manifest.icons as unknown[]) {
    const read = readManifestIcon(icon);

    if (read !== undefined) {
      icons.push(read);
    }
  }

  return icons;
}

function readManifestIcon(icon: unknown): ManifestIcon | undefined {
  if (typeof icon !== "object" || icon === null) {
    return undefined;
  }

  const {src, sizes, type, purpose} = icon as Record<string, unknown>;

  if (typeof src !== "string" || typeof sizes !== "string" || typeof type !== "string") {
    return undefined;
  }

  if (typeof purpose !== "string") {
    return {src, sizes, type, purpose: "any"};
  }

  return {src, sizes, type, purpose};
}
