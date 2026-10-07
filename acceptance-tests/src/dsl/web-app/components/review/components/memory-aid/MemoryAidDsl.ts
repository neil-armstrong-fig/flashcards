import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import {MemoryAidPlaywright} from "@src/dsl/web-app/components/review/components/memory-aid/playwright/MemoryAidPlaywright";

/** The note and picture on a card, which a struggling card asks for and a learner can later fade away. */
export class MemoryAidDsl {
  private readonly playwright: MemoryAidPlaywright;

  constructor(page: Page) {
    this.playwright = new MemoryAidPlaywright(page);
  }

  /** Writes a note on the card on screen and saves it. */
  async addNote(text: string): Promise<void> {
    try {
      await this.playwright.addNote(text);
    } catch (error) {
      throw new DslError("Failed to add a note to the card", error);
    }
  }

  /** Takes the note off the card on screen. */
  async removeNote(): Promise<void> {
    try {
      await this.playwright.removeNote();
    } catch (error) {
      throw new DslError("Failed to remove the note from the card", error);
    }
  }

  /** The note on the card on screen, or undefined when it has none. */
  async getNote(): Promise<string | undefined> {
    try {
      return await this.playwright.note();
    } catch (error) {
      throw new DslError("Failed to read the note on the card", error);
    }
  }

  /** Chooses a small picture from the learner's files for the card on screen. */
  async addPicture(): Promise<void> {
    try {
      await this.playwright.addPicture();
    } catch (error) {
      throw new DslError("Failed to add a picture to the card", error);
    }
  }

  /** Chooses a picture with far more pixels than a card needs, as a phone's camera makes, for the card on screen. */
  async addVeryLargePicture(): Promise<void> {
    try {
      await this.playwright.addVeryLargePicture();
    } catch (error) {
      throw new DslError("Failed to add a very large picture to the card", error);
    }
  }

  /** How many pixels wide the picture on the card is, as kept. */
  async getPictureWidth(): Promise<number> {
    try {
      return await this.playwright.pictureWidth();
    } catch (error) {
      throw new DslError("Failed to read how wide the picture is", error);
    }
  }

  /** Pastes a picture from the clipboard onto the card on screen. */
  async pastePicture(): Promise<void> {
    try {
      await this.playwright.pastePicture();
    } catch (error) {
      throw new DslError("Failed to paste a picture onto the card", error);
    }
  }

  /** Chooses a file that is not a picture for the card on screen. */
  async addTextFileAsPicture(): Promise<void> {
    try {
      await this.playwright.addTextFileAsPicture();
    } catch (error) {
      throw new DslError("Failed to choose a file that is not a picture", error);
    }
  }

  /** Takes the picture off the card on screen. */
  async removePicture(): Promise<void> {
    try {
      await this.playwright.removePicture();
    } catch (error) {
      throw new DslError("Failed to remove the picture from the card", error);
    }
  }

  /** Whether the card on screen shows a picture that has loaded. */
  async isPictureShown(): Promise<boolean> {
    try {
      return await this.playwright.pictureShown();
    } catch (error) {
      throw new DslError("Failed to tell whether the card shows a picture", error);
    }
  }

  /** Why the last picture was refused, or undefined. */
  async getPictureError(): Promise<string | undefined> {
    try {
      return await this.playwright.pictureError();
    } catch (error) {
      throw new DslError("Failed to read why the picture was refused", error);
    }
  }

  /** Takes up the offer to remove the card's note and picture. */
  async removeTheAids(): Promise<void> {
    try {
      await this.playwright.removeTheAids();
    } catch (error) {
      throw new DslError("Failed to remove the note and picture when offered", error);
    }
  }

  /** Declines the offer to remove the card's note and picture. */
  async keepTheAids(): Promise<void> {
    try {
      await this.playwright.keepTheAids();
    } catch (error) {
      throw new DslError("Failed to keep the note and picture when offered", error);
    }
  }

  /** Whether the card on screen offers to remove its note and picture. */
  async isRemovingTheAidsOffered(): Promise<boolean> {
    try {
      return await this.playwright.removingTheAidsOffered();
    } catch (error) {
      throw new DslError("Failed to tell whether removing the aids is offered", error);
    }
  }

  /** Whether the card on screen asks the learner to add a note or picture, as it does for a struggling card with neither. */
  async isPromptedToAddAMemoryAid(): Promise<boolean> {
    try {
      return await this.playwright.promptedToAddAMemoryAid();
    } catch (error) {
      throw new DslError("Failed to tell whether the learner is prompted to add a note or picture", error);
    }
  }
}
