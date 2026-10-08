import type {Locator, Page} from "@playwright/test";
import type {Rating} from "@flashcards/shared/study/Rating";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import type {ShownNotation} from "@src/dsl/web-app/components/review/types/ShownNotation";
import {withMoreOptions} from "@src/dsl/web-app/components/review/playwright/with-more-options/WithMoreOptions";

const RATING_KEYS: Record<Rating, string> = {again: "1", hard: "2", good: "3", easy: "4"};

type AsideWay = "bury" | "suspend";

export class ReviewPlaywright extends BaseComponent {
  private readonly ratingButtons: Record<Rating, Locator>;

  constructor(page: Page) {
    super(page);
    this.ratingButtons = {
      again: page.getByTestId("rate-again"),
      hard: page.getByTestId("rate-hard"),
      good: page.getByTestId("rate-good"),
      easy: page.getByTestId("rate-easy"),
    };
  }

  async frontText(): Promise<string> {
    return await this.page.getByTestId("card-front").innerText();
  }

  async notation(): Promise<ShownNotation> {
    const notation = this.page.getByTestId("card-notation");
    const clef = await notation.getAttribute("data-clef");
    const steps = await notation.getAttribute("data-steps-above-bottom-line");

    if (clef === null || steps === null) {
      throw new Error("The card's notation does not say its clef and position");
    }

    return {clef, stepsAboveBottomLine: Number(steps)};
  }

  async backText(): Promise<string> {
    return await this.page.getByTestId("card-back").innerText();
  }

  /** The part of the answer picked out in bold, or an empty string while there is none. */
  async emphasisedText(): Promise<string> {
    await this.page.getByTestId("card-front").waitFor();

    const emphasis = this.page.getByTestId("card-back").locator("strong");

    if ((await emphasis.count()) === 0) {
      return "";
    }

    return await emphasis.innerText();
  }

  async frontHidden(): Promise<boolean> {
    return await this.page.getByTestId("card-front-hidden").isVisible();
  }

  async answerShown(): Promise<boolean> {
    return await this.page.getByTestId("card-back").isVisible();
  }

  async showAnswer(): Promise<void> {
    await this.page.getByTestId("show-answer").click();
    await this.page.getByTestId("card-back").waitFor();
  }

  async intervalLabel(rating: Rating): Promise<string> {
    return await this.page.getByTestId(`rate-${rating}-interval`).innerText();
  }

  async canRate(rating: Rating): Promise<boolean> {
    return await this.ratingButtons[rating].isVisible();
  }

  /** Rates the card and waits for the screen to move on to the next card or the end of the session. */
  async rate(rating: Rating): Promise<void> {
    const before = await this.page.getByTestId("card-front").innerText();
    await this.ratingButtons[rating].click();
    await this.waitForTheScreenToMoveOn(before);
  }

  private async waitForTheScreenToMoveOn(before: string): Promise<void> {
    await this.page.waitForFunction(previous => {
      const front = document.querySelector('[data-testid="card-front"]');
      const complete = document.querySelector('[data-testid="session-complete"]');
      const back = document.querySelector('[data-testid="card-back"]');
      return complete !== null || (front !== null && back === null) || front?.textContent !== previous;
    }, before);
  }

  async cardsRemaining(): Promise<number> {
    return Number(await this.page.getByTestId("cards-remaining").innerText());
  }

  async sessionComplete(): Promise<boolean> {
    return await this.page.getByTestId("session-complete").isVisible();
  }

  async lookingAhead(): Promise<boolean> {
    await this.page.getByTestId("review-screen").waitFor();

    return (await this.page.getByTestId("preview-notice").count()) > 0;
  }

  async next(): Promise<void> {
    await this.page.getByTestId("preview-next").click();
  }

  async finishSession(): Promise<void> {
    await this.page.getByTestId("finish-session").click();
    await this.page.getByTestId("review-screen").waitFor({state: "detached"});
  }

  async leaveSession(): Promise<void> {
    await this.page.getByTestId("leave-session").click();
    await this.page.getByTestId("review-screen").waitFor({state: "detached"});
  }

  async shapeSimilars(): Promise<string[]> {
    await this.page.getByTestId("card-front").waitFor();

    return (await this.page.getByTestId("shape-similar").allInnerTexts()).map(text => text.trim());
  }

  async explanation(): Promise<string> {
    await this.page.getByTestId("card-front").waitFor();

    const explanation = this.page.getByTestId("card-explanation");

    if ((await explanation.count()) === 0) {
      return "";
    }

    return (await explanation.innerText()).trim();
  }

  /** Sets the card aside (buries or suspends it) and waits for the next card, or the end of the session, to be on screen. */
  async setAside(how: AsideWay): Promise<void> {
    const before = await this.page.getByTestId("card-front").innerText();

    await withMoreOptions(this.page, async () => {
      await this.page.getByTestId(`${how}-card`).click();
      await this.waitForTheCardToChange(before);
    });
  }

  /** The card on screen was not answered, so an unanswered front is not proof it moved on: only a different card, or the end, is. */
  private async waitForTheCardToChange(before: string): Promise<void> {
    await this.page.waitForFunction(previous => {
      const front = document.querySelector('[data-testid="card-front"]');
      const complete = document.querySelector('[data-testid="session-complete"]');
      return complete !== null || (front !== null && front.textContent !== previous);
    }, before);
  }

  async showAnswerWithKeyboard(): Promise<void> {
    await this.page.keyboard.press("Space");
  }

  /** Presses a rating's key. Waits for the next card only if the answer was shown, since otherwise the key does nothing. */
  async rateWithKeyboard(rating: Rating): Promise<void> {
    const answerShown = await this.answerShown();
    const before = answerShown ? await this.page.getByTestId("card-front").innerText() : undefined;

    await this.page.keyboard.press(RATING_KEYS[rating]);

    if (before !== undefined) {
      await this.waitForTheScreenToMoveOn(before);
    }
  }
}
