import type {Page} from "@playwright/test";
import {DslError} from "@src/dsl/errors/DslError";
import type {PlayedRecording} from "@src/dsl/web-app/components/review/components/sound/types/PlayedRecording";
import {SoundPlaywright} from "@src/dsl/web-app/components/review/components/sound/playwright/SoundPlaywright";

/** What the card says aloud: the recordings played, replaying one, and switching the voice or speed. */
export class SoundDsl {
  private readonly playwright: SoundPlaywright;

  constructor(page: Page) {
    this.playwright = new SoundPlaywright(page);
  }

  /** Every recording the app has played since it opened, oldest first, whether or not the app could find the file. */
  async getRecordingsPlayed(): Promise<readonly PlayedRecording[]> {
    try {
      return await this.playwright.recordingsPlayed();
    } catch (error) {
      throw new DslError("Failed to read which recordings were played", error);
    }
  }

  /** Whether the voice can be switched: only while the Korean is the thing being spoken, since English has the one voice. */
  async canSwitchVoice(): Promise<boolean> {
    try {
      return await this.playwright.canSwitchVoice();
    } catch (error) {
      throw new DslError("Failed to tell whether the voice can be switched", error);
    }
  }

  async canSwitchSpeed(): Promise<boolean> {
    try {
      return await this.playwright.canSwitchSpeed();
    } catch (error) {
      throw new DslError("Failed to tell whether the speed can be switched", error);
    }
  }

  /** Switches between the female and male voice, which speaks the word again so the two can be compared. */
  async switchVoice(): Promise<void> {
    try {
      await this.playwright.switchVoice();
    } catch (error) {
      throw new DslError("Failed to switch the voice", error);
    }
  }

  /** Switches between normal and slower speed, which speaks the word again. */
  async switchSpeed(): Promise<void> {
    try {
      await this.playwright.switchSpeed();
    } catch (error) {
      throw new DslError("Failed to switch the speed", error);
    }
  }

  async replay(): Promise<void> {
    try {
      await this.playwright.replay();
    } catch (error) {
      throw new DslError("Failed to replay the recording", error);
    }
  }
}
