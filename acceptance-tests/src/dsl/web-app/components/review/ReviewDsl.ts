import type {Page} from "@playwright/test";
import type {Rating} from "@flashcards/shared/study/Rating";
import {DslError} from "@src/dsl/errors/DslError";
import {SimilarDsl} from "@src/dsl/web-app/components/review/components/similar/SimilarDsl";
import {ReviewPlaywright} from "@src/dsl/web-app/components/review/playwright/ReviewPlaywright";
import {MemoryAidDsl} from "@src/dsl/web-app/components/review/components/memory-aid/MemoryAidDsl";
import {MoreOptionsDsl} from "@src/dsl/web-app/components/review/components/more-options/MoreOptionsDsl";
import {SoundDsl} from "@src/dsl/web-app/components/review/components/sound/SoundDsl";
import {ReviewStrugglingDsl} from "@src/dsl/web-app/components/review/components/struggling/ReviewStrugglingDsl";

/** The review screen, where cards are shown one at a time and rated. */
export class ReviewDsl {
  private readonly playwright: ReviewPlaywright;

  readonly similar: SimilarDsl;
  readonly memoryAid: MemoryAidDsl;
  readonly moreOptions: MoreOptionsDsl;
  readonly sound: SoundDsl;
  readonly struggling: ReviewStrugglingDsl;

  constructor(page: Page) {
    this.playwright = new ReviewPlaywright(page);
    this.similar = new SimilarDsl(page);
    this.memoryAid = new MemoryAidDsl(page);
    this.moreOptions = new MoreOptionsDsl(page);
    this.sound = new SoundDsl(page);
    this.struggling = new ReviewStrugglingDsl(page);
  }

  async getFrontText(): Promise<string> {
    try {
      return await this.playwright.frontText();
    } catch (error) {
      throw new DslError("Failed to read the front of the card", error);
    }
  }

  /** The characters the card on screen warns are easily mixed up with it, each with its sound (`ツ tsu`). Empty until the answer is shown. */
  async getShapeSimilars(): Promise<string[]> {
    try {
      return await this.playwright.shapeSimilars();
    } catch (error) {
      throw new DslError("Failed to read the characters that look like this one", error);
    }
  }

  /** The explanation of the card on screen, such as why a rare kana exists. Empty until the answer is shown, and for a card with none. */
  async getExplanation(): Promise<string> {
    try {
      return await this.playwright.explanation();
    } catch (error) {
      throw new DslError("Failed to read the explanation of the card", error);
    }
  }

  async getBackText(): Promise<string> {
    try {
      return await this.playwright.backText();
    } catch (error) {
      throw new DslError("Failed to read the back of the card", error);
    }
  }

  /** The part of the answer picked out in bold (the word that was said, on a sounds-alike pair). Empty until the answer is shown, and for a card with none. */
  async getEmphasisedText(): Promise<string> {
    try {
      return await this.playwright.emphasisedText();
    } catch (error) {
      throw new DslError("Failed to read the part of the card in bold", error);
    }
  }

  /** Whether the front is hidden because the learner chose to listen without reading. */
  async isFrontHidden(): Promise<boolean> {
    try {
      return await this.playwright.frontHidden();
    } catch (error) {
      throw new DslError("Failed to tell whether the front of the card is hidden", error);
    }
  }

  async isAnswerShown(): Promise<boolean> {
    try {
      return await this.playwright.answerShown();
    } catch (error) {
      throw new DslError("Failed to tell whether the answer is shown", error);
    }
  }

  async showAnswer(): Promise<void> {
    try {
      await this.playwright.showAnswer();
    } catch (error) {
      throw new DslError("Failed to show the answer", error);
    }
  }

  /** How long until the card comes back if it is rated this way, as the button says it: `10m`, `3d`. */
  async getIntervalLabel(rating: Rating): Promise<string> {
    try {
      return await this.playwright.intervalLabel(rating);
    } catch (error) {
      throw new DslError(`Failed to read how soon a card rated ${rating} comes back`, error);
    }
  }

  async canRate(rating: Rating): Promise<boolean> {
    try {
      return await this.playwright.canRate(rating);
    } catch (error) {
      throw new DslError(`Failed to tell whether the card can be rated ${rating}`, error);
    }
  }

  /** Shows the answer if it is hidden, then rates the card. */
  async rate(rating: Rating): Promise<void> {
    try {
      if (!(await this.playwright.answerShown())) {
        await this.playwright.showAnswer();
      }
      await this.playwright.rate(rating);
    } catch (error) {
      throw new DslError(`Failed to rate the card ${rating}`, error);
    }
  }

  async getCardsRemaining(): Promise<number> {
    try {
      return await this.playwright.cardsRemaining();
    } catch (error) {
      throw new DslError("Failed to read how many cards remain in the session", error);
    }
  }

  async isSessionComplete(): Promise<boolean> {
    try {
      return await this.playwright.sessionComplete();
    } catch (error) {
      throw new DslError("Failed to tell whether the session is complete", error);
    }
  }

  /** Whether the screen says this is a look ahead, whose answers are not kept. */
  async isLookingAhead(): Promise<boolean> {
    try {
      return await this.playwright.lookingAhead();
    } catch (error) {
      throw new DslError("Failed to tell whether the learner is looking ahead", error);
    }
  }

  /** Moves on from a card in a look ahead, which has no rating. */
  async next(): Promise<void> {
    try {
      await this.playwright.next();
    } catch (error) {
      throw new DslError("Failed to move on to the next card", error);
    }
  }

  async finishSession(): Promise<void> {
    try {
      await this.playwright.finishSession();
    } catch (error) {
      throw new DslError("Failed to finish the session", error);
    }
  }

  /** Leaves the session before it is finished, back to the home screen. */
  async leaveSession(): Promise<void> {
    try {
      await this.playwright.leaveSession();
    } catch (error) {
      throw new DslError("Failed to leave the session early", error);
    }
  }

  /** Hides the card until tomorrow. */
  async bury(): Promise<void> {
    try {
      await this.playwright.setAside("bury");
    } catch (error) {
      throw new DslError("Failed to bury the card", error);
    }
  }

  /** Hides the card until the learner brings it back from the settings. */
  async suspend(): Promise<void> {
    try {
      await this.playwright.setAside("suspend");
    } catch (error) {
      throw new DslError("Failed to suspend the card", error);
    }
  }

  async showAnswerWithKeyboard(): Promise<void> {
    try {
      await this.playwright.showAnswerWithKeyboard();
    } catch (error) {
      throw new DslError("Failed to show the answer with the keyboard", error);
    }
  }

  async rateWithKeyboard(rating: Rating): Promise<void> {
    try {
      await this.playwright.rateWithKeyboard(rating);
    } catch (error) {
      throw new DslError(`Failed to rate the card ${rating} with the keyboard`, error);
    }
  }
}
