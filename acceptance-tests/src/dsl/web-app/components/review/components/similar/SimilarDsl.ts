import type {Page} from "@playwright/test";
import {SimilarPlaywright} from "@src/dsl/web-app/components/review/components/similar/playwright/SimilarPlaywright";
import {DslError} from "@src/dsl/errors/DslError";

/** The panel on a card for hearing its word beside the words the learner mistakes it for. */
export class SimilarDsl {
  private readonly playwright: SimilarPlaywright;

  constructor(page: Page) {
    this.playwright = new SimilarPlaywright(page);
  }

  /** Whether comparing is offered right now: not while the front is showing, so it never gives the answer away. */
  async canOpen(): Promise<boolean> {
    try {
      return await this.playwright.canOpen();
    } catch (error) {
      throw new DslError("Failed to tell whether comparing is offered", error);
    }
  }

  /** Whether the learner can ask for a word of their own: only when signed in. */
  async canAdd(): Promise<boolean> {
    try {
      return await this.playwright.canAdd();
    } catch (error) {
      throw new DslError("Failed to tell whether a word can be added", error);
    }
  }

  async open(): Promise<void> {
    try {
      await this.playwright.open();
    } catch (error) {
      throw new DslError("Failed to open the similar", error);
    }
  }

  /** The similars offered for this card's word, in the order they were added. */
  async getWords(): Promise<string[]> {
    try {
      return await this.playwright.words();
    } catch (error) {
      throw new DslError("Failed to read the similar words", error);
    }
  }

  /** Plays a similar, in the voice and at the speed currently chosen. */
  async play(word: string): Promise<void> {
    try {
      await this.playwright.play(word);
    } catch (error) {
      throw new DslError(`Failed to play ${word}`, error);
    }
  }

  /** Switches between the female and male voice, which plays the card's own word again in it: the similars then play that way too. */
  async switchVoice(): Promise<void> {
    try {
      await this.playwright.switchVoice();
    } catch (error) {
      throw new DslError("Failed to switch the voice from the similar", error);
    }
  }

  async switchSpeed(): Promise<void> {
    try {
      await this.playwright.switchSpeed();
    } catch (error) {
      throw new DslError("Failed to switch the speed from the similar", error);
    }
  }

  /** Whether a similar can be deleted: only the ones the learner added. */
  async canDelete(word: string): Promise<boolean> {
    try {
      return await this.playwright.canDelete(word);
    } catch (error) {
      throw new DslError(`Failed to tell whether ${word} can be deleted`, error);
    }
  }

  /** Deletes a similar the learner added, here and online. */
  async delete(word: string): Promise<void> {
    try {
      await this.playwright.delete(word);
    } catch (error) {
      throw new DslError(`Failed to delete ${word}`, error);
    }
  }

  async playOwn(): Promise<void> {
    try {
      await this.playwright.playOwn();
    } catch (error) {
      throw new DslError("Failed to play the card's own word", error);
    }
  }

  /** Plays the card's own word and then the similar, to hear the difference. */
  async playBoth(word: string): Promise<void> {
    try {
      await this.playwright.playBoth(word);
    } catch (error) {
      throw new DslError(`Failed to play the card's word and then ${word}`, error);
    }
  }

  /** Asks for a recording of a word the learner mistakes this one for, and waits until it is kept with the card. */
  async add(word: string): Promise<void> {
    try {
      await this.playwright.add(word);
    } catch (error) {
      throw new DslError(`Failed to add ${word}`, error);
    }
  }

  /** Why the last word could not be added, or an empty string. */
  async getError(): Promise<string> {
    try {
      return await this.playwright.error();
    } catch (error) {
      throw new DslError("Failed to read the similar's error", error);
    }
  }
}
