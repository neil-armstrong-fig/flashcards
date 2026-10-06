import type {Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/** The panel for hearing a word beside the ones it is mistaken for. */
export class SimilarPlaywright extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  async canOpen(): Promise<boolean> {
    return await this.page.getByTestId("similar-open").isVisible();
  }

  async canAdd(): Promise<boolean> {
    return await this.page.getByTestId("similar-add").isVisible();
  }

  async open(): Promise<void> {
    await this.page.getByTestId("similar-open").click();
    await this.page.getByTestId("similar-panel").waitFor();
  }

  async words(): Promise<string[]> {
    return await this.page.getByTestId("similar-word").allInnerTexts();
  }

  async play(word: string): Promise<void> {
    await this.waitForSoundAfter(async () => {
      await this.row(word).getByTestId("similar-play").click();
    });
  }

  /** Switches between the female and male voice from the panel, which speaks the card's own word again in it. */
  async switchVoice(): Promise<void> {
    await this.waitForSoundAfter(async () => {
      await this.page.getByTestId("similar-switch-voice").click();
    });
  }

  async switchSpeed(): Promise<void> {
    await this.waitForSoundAfter(async () => {
      await this.page.getByTestId("similar-switch-speed").click();
    });
  }

  /** Whether a similar has a delete button: only the ones the learner added, never the ones that came with the word. */
  async canDelete(word: string): Promise<boolean> {
    return await this.row(word).getByTestId("similar-delete").isVisible();
  }

  /** Deletes a similar and waits until it is gone from the list. */
  async delete(word: string): Promise<void> {
    await this.row(word).getByTestId("similar-delete").click();
    await this.row(word).waitFor({state: "detached"});
  }

  async playOwn(): Promise<void> {
    await this.waitForSoundAfter(async () => {
      await this.page.getByTestId("similar-play-own").click();
    });
  }

  /** Plays the card's word then the similar, and waits until both have been heard. */
  async playBoth(word: string): Promise<void> {
    await this.waitForSoundAfter(async () => {
      await this.row(word).getByTestId("similar-play-both").click();
    }, 2);
  }

  /** Asks for a word and waits until it has been added (the field empties) or the reason it could not be is shown. */
  async add(word: string): Promise<void> {
    await this.page.getByTestId("similar-input").fill(word);
    await this.page.getByTestId("similar-add").click();
    await this.page.waitForFunction(() => {
      const input = document.querySelector<HTMLInputElement>('[data-testid="similar-input"]');
      const error = document.querySelector('[data-testid="similar-error"]');

      return error !== null || input?.value === "";
    });
  }

  async error(): Promise<string> {
    return await this.page.getByTestId("similar-error").innerText();
  }

  private row(word: string): ReturnType<Page["getByTestId"]> {
    return this.page
      .getByTestId("similar-row")
      .filter({has: this.page.getByTestId("similar-word").getByText(word, {exact: true})});
  }

  private async waitForSoundAfter(act: () => Promise<void>, sounds = 1): Promise<void> {
    const before = await this.page.evaluate(() => window.fakeAudio.played.length);

    await act();
    await this.page.waitForFunction(({count, expected}) => window.fakeAudio.played.length >= count + expected, {
      count: before,
      expected: sounds,
    });
  }
}
