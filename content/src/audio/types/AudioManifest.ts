import type {RecordingVariant} from "@flashcards/shared/audio/RecordingVariant";

/** Where each of one text's recordings is, as a path under `audio/`. A variant the generator has not made yet is absent. */
export type RecordingFiles = Readonly<Partial<Record<RecordingVariant, string>>>;

/**
 * Every recording there is, by language and then by the text spoken. The generator in `tools/` writes it, and the app plays
 * only what it names: a text with no entry is simply not spoken.
 */
export type AudioManifest = Readonly<Record<string, Readonly<Record<string, RecordingFiles>>>>;
