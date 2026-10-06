import type {Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import type {StrugglingCard} from "@src/dsl/web-app/components/struggling/types/StrugglingCard";

/** The screen listing the cards the learner keeps forgetting. */
export class StrugglingPlaywright extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  async cards(): Promise<StrugglingCard[]> {
    const rows = this.page.getByTestId("struggling-card");
    const cards: StrugglingCard[] = [];

    for (const row of await rows.all()) {
      cards.push({
        front: await row.getByTestId("struggling-card-front").innerText(),
        back: await row.getByTestId("struggling-card-back").innerText(),
        lapses: Number(await row.getByTestId("struggling-card-lapses").innerText()),
        status: await row.getByTestId("struggling-card-status").innerText(),
      });
    }

    return cards;
  }

  async bringBack(front: string): Promise<void> {
    const row = this.page
      .getByTestId("struggling-card")
      .filter({has: this.page.getByTestId("struggling-card-front").getByText(front, {exact: true})})
      .first();

    await row.getByTestId("struggling-card-bring-back").click();
    await row.getByTestId("struggling-card-bring-back").waitFor({state: "detached"});
  }

  async close(): Promise<void> {
    await this.page.getByTestId("close-struggling").click();
    await this.page.getByTestId("struggling-screen").waitFor({state: "detached"});
  }
}
