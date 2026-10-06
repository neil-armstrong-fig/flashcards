/** An audio player that makes no sound and writes down what it was asked to play, in order, for tests. */
export class RecordingAudioPlayer {
  readonly played: string[] = [];

  play(url: string): void {
    this.played.push(url);
  }

  playInOrder(urls: readonly string[]): void {
    this.played.push(...urls);
  }
}
