import type {SpokenLanguage} from "@language-learning/shared/language/SpokenLanguage";

/** The speech API and the browser's cache of what a learner added, in memory for a test: keeps nothing, writes down the texts asked for, and can be told to fail. */
export class FakeKeptAudio {
  readonly kept: string[] = [];
  failing = false;

  async has(_language: SpokenLanguage, text: string): Promise<boolean> {
    return this.kept.includes(text);
  }

  async keep(_language: SpokenLanguage, text: string): Promise<void> {
    if (this.failing) {
      throw new Error("The speech service is down.");
    }

    if (!this.kept.includes(text)) {
      this.kept.push(text);
    }
  }
}
