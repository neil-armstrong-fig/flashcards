/** What the SSML for one recording needs to know. */
export interface SsmlSubject {
  readonly text: string;
  readonly voiceName: string;
  /** The Azure locale the voice speaks, such as `ko-KR`. */
  readonly locale: string;
  /** The SSML prosody rate, or `default` for none. */
  readonly rate: string;
}
