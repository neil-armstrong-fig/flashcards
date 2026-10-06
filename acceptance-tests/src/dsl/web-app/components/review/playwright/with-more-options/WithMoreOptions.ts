import type {Page} from "@playwright/test";

/**
 * Opens the more options, runs what is wanted inside them, and closes them again if they are still open. Setting a card aside moves
 * on to the next card, which closes them, so they are only closed if they are still there.
 */
export async function withMoreOptions<Result>(page: Page, action: () => Promise<Result>): Promise<Result> {
  await page.getByTestId("more-options").click();
  await page.getByTestId("more-options-dialog").waitFor();

  const result = await action();

  if (await page.getByTestId("more-options-dialog").isVisible()) {
    await page.getByTestId("more-options-close").click();
    await page.getByTestId("more-options-dialog").waitFor({state: "hidden"});
  }

  return result;
}
