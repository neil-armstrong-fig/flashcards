import type {Page} from "@playwright/test";
import type {Speed} from "@flashcards/shared/audio/Speed";
import type {Voice} from "@flashcards/shared/audio/Voice";
import {DslError} from "@src/dsl/errors/DslError";
import {SettingsVoicePlaywright} from "@src/dsl/web-app/components/settings/components/voice/playwright/SettingsVoicePlaywright";

/** Which voice and speed the app speaks with. */
export class SettingsVoiceDsl {
  private readonly playwright: SettingsVoicePlaywright;

  constructor(page: Page) {
    this.playwright = new SettingsVoicePlaywright(page);
  }

  async chooseVoice(voice: Voice): Promise<void> {
    try {
      await this.playwright.chooseVoice(voice);
    } catch (error) {
      throw new DslError(`Failed to choose the ${voice} voice`, error);
    }
  }

  async getVoice(): Promise<Voice> {
    try {
      return await this.playwright.voice();
    } catch (error) {
      throw new DslError("Failed to read the chosen voice", error);
    }
  }

  async chooseSpeed(speed: Speed): Promise<void> {
    try {
      await this.playwright.chooseSpeed(speed);
    } catch (error) {
      throw new DslError(`Failed to choose ${speed} speed`, error);
    }
  }

  async getSpeed(): Promise<Speed> {
    try {
      return await this.playwright.speed();
    } catch (error) {
      throw new DslError("Failed to read the chosen speed", error);
    }
  }
}
