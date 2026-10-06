/**
 * Raise the version, and teach `loadSettings` the old shape, when a stored field changes meaning or is removed. A new field needs
 * neither: each is read alone and falls back to its default, so what was kept before it still loads.
 */
export const SETTINGS_STORAGE_KEY = "language-learning.settings.v1";
