import type {Page} from "@playwright/test";
import type {OfflineStatus} from "@src/dsl/web-app/components/home/types/OfflineStatus";
import type {DeckId} from "@src/dsl/web-app/types/DeckId";
import type {DeckDueCounts} from "@src/dsl/web-app/components/home/types/DeckDueCounts";
import type {NarrowFocus} from "@src/dsl/web-app/types/NarrowFocus";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

export class HomePlaywright extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  async cardsDueToday(deck: DeckId): Promise<number> {
    return Number(await this.page.getByTestId(`deck-due-${deck}`).innerText());
  }

  async deckDueCounts(deck: DeckId): Promise<DeckDueCounts> {
    return {
      new: Number(await this.page.getByTestId(`deck-new-${deck}`).innerText()),
      learning: Number(await this.page.getByTestId(`deck-learning-${deck}`).innerText()),
      review: Number(await this.page.getByTestId(`deck-review-${deck}`).innerText()),
    };
  }

  async startReviewingOnly(deck: DeckId, focus: NarrowFocus): Promise<void> {
    await this.page.getByTestId(`study-only-${focus}-${deck}`).click();
    await this.page.getByTestId("review-screen").waitFor();
  }

  async canStudyOnly(deck: DeckId, focus: NarrowFocus): Promise<boolean> {
    await this.page.getByTestId(`deck-${deck}`).waitFor();

    return (await this.page.getByTestId(`study-only-${focus}-${deck}`).count()) > 0;
  }

  async studyOnlyCount(deck: DeckId, focus: NarrowFocus): Promise<number> {
    return Number(await this.page.getByTestId(`study-only-count-${focus}-${deck}`).innerText());
  }

  async lookAheadCount(deck: DeckId): Promise<number> {
    await this.page.getByTestId(`deck-${deck}`).waitFor();

    const count = this.page.getByTestId(`look-ahead-count-${deck}`);

    if ((await count.count()) === 0) {
      return 0;
    }

    return Number(await count.innerText());
  }

  async lookAhead(deck: DeckId): Promise<void> {
    await this.page.getByTestId(`look-ahead-${deck}`).click();
    await this.page.getByTestId("review-screen").waitFor();
  }

  async offlineStatus(deck: DeckId): Promise<OfflineStatus> {
    await this.page.getByTestId(`offline-total-${deck}`).waitFor();

    return {
      kept: Number(await this.page.getByTestId(`offline-kept-${deck}`).innerText()),
      total: Number(await this.page.getByTestId(`offline-total-${deck}`).innerText()),
    };
  }

  async keepOffline(deck: DeckId): Promise<void> {
    await this.page.getByTestId(`keep-offline-${deck}`).click();
    await this.page.getByTestId(`offline-done-${deck}`).waitFor({timeout: 60_000});
  }

  async dailyGoal(): Promise<number> {
    return Number(await this.page.getByTestId("daily-goal").innerText());
  }

  async cardsReviewedToday(): Promise<number> {
    return Number(await this.page.getByTestId("cards-reviewed-today").innerText());
  }

  async dailyGoalMet(): Promise<boolean> {
    return await this.page.getByTestId("daily-goal-met").isVisible();
  }

  async startReviewing(deck: DeckId): Promise<void> {
    await this.page.getByTestId(`start-reviewing-${deck}`).click();
    await this.page.getByTestId("review-screen").waitFor();
  }

  async openBrowse(): Promise<void> {
    await this.page.getByTestId("open-browse").click();
    await this.page.getByTestId("browse-screen").waitFor();
  }

  async strugglingCount(): Promise<number> {
    return Number(await this.page.getByTestId("struggling-count").innerText());
  }

  async openStruggling(): Promise<void> {
    await this.page.getByTestId("open-struggling").click();
    await this.page.getByTestId("struggling-screen").waitFor();
  }

  async openSettings(): Promise<void> {
    await this.page.getByTestId("open-settings").click();
    await this.page.getByTestId("settings-screen").waitFor();
  }
}
