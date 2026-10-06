import type {Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import {withMoreOptions} from "@src/dsl/web-app/components/review/playwright/with-more-options/WithMoreOptions";

export class ReviewStrugglingPlaywright extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  async markHard(): Promise<void> {
    await withMoreOptions(this.page, async () => {
      await this.page.getByTestId("mark-hard").click();
      await this.page.getByTestId("marked-hard").waitFor();
    });
  }

  async onStrugglingList(): Promise<boolean> {
    return await withMoreOptions(this.page, async () => await this.page.getByTestId("marked-hard").isVisible());
  }

  async strugglingNotice(): Promise<number> {
    const notice = this.page.getByTestId("struggling-notice-count");

    if (!(await notice.isVisible())) {
      return 0;
    }

    return Number(await notice.innerText());
  }

  async openStrugglingFromSession(): Promise<void> {
    await this.page.getByTestId("review-struggling").click();
    await this.page.getByTestId("struggling-screen").waitFor();
  }
}
