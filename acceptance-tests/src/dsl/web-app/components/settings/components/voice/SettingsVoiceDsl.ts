import type {Page} from "@playwright/test";
import type {Speed} from "@flashcards/shared/audio/Speed";
import type {Voice} from "@flashcards/shared/audio/Voice";
import type {DeckId} from "@src/dsl/web-app/types/DeckId";
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

  /** The voice that speaks a deck's cards when it is reviewed. */
  async chooseDeckVoice(deck: DeckId, voice: Voice): Promise<void> {
    try {
      await this.playwright.chooseDeckVoice(deck, voice);
    } catch (error) {
      throw new DslError(`Failed to choose the ${voice} voice for ${deck}`, error);
    }
  }

  async getDeckVoice(deck: DeckId): Promise<Voice> {
    try {
      return await this.playwright.deckVoice(deck);
    } catch (error) {
      throw new DslError(`Failed to read the voice chosen for ${deck}`, error);
    }
  }

  /** How fast a deck's cards are spoken when it is reviewed. */
  async chooseDeckSpeed(deck: DeckId, speed: Speed): Promise<void> {
    try {
      await this.playwright.chooseDeckSpeed(deck, speed);
    } catch (error) {
      throw new DslError(`Failed to choose ${speed} speed for ${deck}`, error);
    }
  }

  async getDeckSpeed(deck: DeckId): Promise<Speed> {
    try {
      return await this.playwright.deckSpeed(deck);
    } catch (error) {
      throw new DslError(`Failed to read the speed chosen for ${deck}`, error);
    }
  }
}
