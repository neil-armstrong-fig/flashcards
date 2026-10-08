/** What the speech markup for one recording needs to know. */
export interface SpeechMarkupSubject {
  readonly text: string;
  readonly voiceName: string;
  /** The Azure locale the voice speaks, such as `ko-KR`. */
  readonly locale: string;
  /** The speech markup prosody rate, or `default` for none. */
  readonly rate: string;
}
