import type {Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

export class SettingsReminderPlaywright extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  async turnOn(): Promise<void> {
    await this.page.getByTestId("reminder-enabled").check();
    await this.page.getByTestId("reminder-hour").waitFor();
  }

  async turnOff(): Promise<void> {
    await this.page.getByTestId("reminder-enabled").uncheck();
  }

  async isOn(): Promise<boolean> {
    return await this.page.getByTestId("reminder-enabled").isChecked();
  }

  async chooseHour(hour: number): Promise<void> {
    await this.page.getByTestId("reminder-hour").selectOption(String(hour));
  }

  async hour(): Promise<number> {
    return Number(await this.page.getByTestId("reminder-hour").inputValue());
  }

  /** Asks the fake API, which keeps what the app sent it, the way a learner could never see. */
  async hourHeldByTheApi(): Promise<number | undefined> {
    const answer = await this.page.evaluate(async () => {
      const response = await fetch("/api/fake/reminder");

      return await response.json();
    });

    if (typeof answer?.hour === "number") {
      return answer.hour;
    }

    return undefined;
  }
}
