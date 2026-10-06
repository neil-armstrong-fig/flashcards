import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import type {Speed} from "@flashcards/shared/audio/Speed";
import type {Voice} from "@flashcards/shared/audio/Voice";

export class SettingsVoicePlaywright extends BaseComponent {
  private readonly voiceChoices: Record<Voice, Locator>;
  private readonly speedChoices: Record<Speed, Locator>;

  constructor(page: Page) {
    super(page);
    this.voiceChoices = {
      female: page.getByTestId("voice-female"),
      male: page.getByTestId("voice-male"),
    };
    this.speedChoices = {
      normal: page.getByTestId("speed-normal"),
      slower: page.getByTestId("speed-slower"),
    };
  }

  async chooseVoice(voice: Voice): Promise<void> {
    await this.voiceChoices[voice].check();
  }

  async voice(): Promise<Voice> {
    if (await this.voiceChoices.male.isChecked()) {
      return "male";
    }

    return "female";
  }

  async chooseSpeed(speed: Speed): Promise<void> {
    await this.speedChoices[speed].check();
  }

  async speed(): Promise<Speed> {
    if (await this.speedChoices.slower.isChecked()) {
      return "slower";
    }

    return "normal";
  }
}
