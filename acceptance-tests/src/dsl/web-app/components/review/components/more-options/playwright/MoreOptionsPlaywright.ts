import type {Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import {withMoreOptions} from "@src/dsl/web-app/components/review/playwright/with-more-options/WithMoreOptions";
import type {ExtraAction} from "@src/dsl/web-app/components/review/components/more-options/types/ExtraAction";

const TEST_IDS = {
  picture: "picture-add",
  note: "note-add",
  hard: "mark-hard",
  bury: "bury-card",
  suspend: "suspend-card",
} as const satisfies Record<ExtraAction, string>;

export class MoreOptionsPlaywright extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.page.getByTestId("more-options").click();
    await this.page.getByTestId("more-options-dialog").waitFor();
  }

  async close(): Promise<void> {
    await this.page.getByTestId("more-options-close").click();
    await this.page.getByTestId("more-options-dialog").waitFor({state: "hidden"});
  }

  async isOpen(): Promise<boolean> {
    return await this.page.getByTestId("more-options-dialog").isVisible();
  }

  /** The extra actions on screen right now, wherever they are. */
  async actionsOnScreen(): Promise<ExtraAction[]> {
    const found: ExtraAction[] = [];

    for (const [action, testId] of Object.entries(TEST_IDS) as [ExtraAction, string][]) {
      if (await this.page.getByTestId(testId).isVisible()) {
        found.push(action);
      }
    }

    return found;
  }

  async moreOptionsOffered(): Promise<boolean> {
    return await this.page.getByTestId("more-options").isVisible();
  }

  async setTargetTextHidden(hidden: boolean): Promise<void> {
    await withMoreOptions(this.page, async () => {
      await this.page.getByTestId("hide-target").setChecked(hidden);
    });
  }
}
