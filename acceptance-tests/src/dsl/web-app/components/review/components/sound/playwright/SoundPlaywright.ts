import type {Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import {readPlayedRecording} from "@src/dsl/web-app/components/review/components/sound/playwright/played-recordings/ReadPlayedRecording";
import type {PlayedRecording} from "@src/dsl/web-app/components/review/components/sound/types/PlayedRecording";

export class SoundPlaywright extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Every recording played so far, once each has been looked for (the fake audio element fetches it as it plays). A recording the
   * device does not yet hold is fetched before it plays, so this waits for the network to go quiet first: a recording still on its way
   * is not left out.
   */
  async recordingsPlayed(): Promise<readonly PlayedRecording[]> {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForFunction(() => window.fakeAudio.played.every(entry => entry.found !== undefined));

    const entries = await this.page.evaluate(() => window.fakeAudio.played);

    return entries.map(readPlayedRecording);
  }

  /** Presses replay and waits until the fake audio element has been asked to play again. */
  async replay(): Promise<void> {
    const before = await this.page.evaluate(() => window.fakeAudio.played.length);

    await this.page.getByTestId("replay-audio").click();
    await this.page.waitForFunction(count => window.fakeAudio.played.length > count, before);
  }

  /** Taps the card's text and waits until the fake audio element has been asked to play again. */
  async tapTheCard(): Promise<void> {
    const before = await this.page.evaluate(() => window.fakeAudio.played.length);

    await this.page.getByTestId("card-front").click();
    await this.page.waitForFunction(count => window.fakeAudio.played.length > count, before);
  }

  async canSwitchVoice(): Promise<boolean> {
    return await this.page.getByTestId("switch-voice").isVisible();
  }

  async canSwitchSpeed(): Promise<boolean> {
    return await this.page.getByTestId("switch-speed").isVisible();
  }

  /** Taps the voice switch and waits until the word has been spoken again. */
  async switchVoice(): Promise<void> {
    await this.switchAndWaitForSound("switch-voice");
  }

  /** Taps the speed switch and waits until the word has been spoken again. */
  async switchSpeed(): Promise<void> {
    await this.switchAndWaitForSound("switch-speed");
  }

  private async switchAndWaitForSound(testId: string): Promise<void> {
    const before = await this.page.evaluate(() => window.fakeAudio.played.length);

    await this.page.getByTestId(testId).click();
    await this.page.waitForFunction(count => window.fakeAudio.played.length > count, before);
  }
}
