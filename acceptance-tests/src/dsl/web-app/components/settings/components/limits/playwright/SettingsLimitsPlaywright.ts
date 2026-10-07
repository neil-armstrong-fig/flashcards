import type {Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import {openDeckSettings} from "@src/dsl/web-app/components/settings/playwright/utils/OpenDeckSettings";
import type {DeckId} from "@src/dsl/web-app/types/DeckId";

export class SettingsLimitsPlaywright extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  async setDesiredRetention(percent: number): Promise<void> {
    await this.page.getByTestId("desired-retention").fill(String(percent));
  }

  async desiredRetention(): Promise<number> {
    return Number(await this.page.getByTestId("desired-retention").inputValue());
  }

  async setNewCardsPerDay(count: number, deck: DeckId): Promise<void> {
    await openDeckSettings(this.page, deck);
    await this.page.getByTestId(`new-cards-per-day-${deck}`).fill(String(count));
  }

  async newCardsPerDay(deck: DeckId): Promise<number> {
    await openDeckSettings(this.page, deck);
    return Number(await this.page.getByTestId(`new-cards-per-day-${deck}`).inputValue());
  }

  async setMaxReviewsPerDay(count: number, deck: DeckId): Promise<void> {
    await openDeckSettings(this.page, deck);
    await this.page.getByTestId(`max-reviews-per-day-${deck}`).fill(String(count));
  }

  async maxReviewsPerDay(deck: DeckId): Promise<number> {
    await openDeckSettings(this.page, deck);
    return Number(await this.page.getByTestId(`max-reviews-per-day-${deck}`).inputValue());
  }

  async setDailyGoal(cards: number): Promise<void> {
    await this.page.getByTestId("daily-goal-input").fill(String(cards));
  }

  async dailyGoal(): Promise<number> {
    return Number(await this.page.getByTestId("daily-goal-input").inputValue());
  }

  async setLimitsUnlocked(unlocked: boolean, deck: DeckId): Promise<void> {
    await openDeckSettings(this.page, deck);
    await this.page.getByTestId(`limits-unlocked-${deck}`).setChecked(unlocked);
  }

  async limitsUnlocked(deck: DeckId): Promise<boolean> {
    await openDeckSettings(this.page, deck);
    return await this.page.getByTestId(`limits-unlocked-${deck}`).isChecked();
  }
}
