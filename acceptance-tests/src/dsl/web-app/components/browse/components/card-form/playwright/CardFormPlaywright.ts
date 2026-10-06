import type {Locator, Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";
import type {NewCardWords} from "@src/dsl/web-app/components/browse/types/NewCardWords";

export class CardFormPlaywright extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  async canAddCard(): Promise<boolean> {
    return await this.page.getByTestId("browse-add-card").isVisible();
  }

  /** Fills in the form for a card of the learner's own and sends it, then waits for the card to be listed or the reason it was refused. */
  async addCard(card: NewCardWords): Promise<void> {
    const before = await this.page.getByTestId("browse-card").count();

    await this.page.getByTestId("new-card-word").fill(card.word);
    await this.page.getByTestId("new-card-meaning").fill(card.meaning);
    if (card.romanisation !== undefined) {
      await this.page.getByTestId("new-card-romanisation").fill(card.romanisation);
    }

    await this.page.getByTestId("browse-add-card").click();
    await this.page.waitForFunction(count => {
      const added = document.querySelectorAll('[data-testid="browse-card"]').length > count;
      const refused = document.querySelector('[data-testid="new-card-error"]') !== null;

      return added || refused;
    }, before);
  }

  async typeNewCardWord(word: string): Promise<void> {
    await this.page.getByTestId("new-card-word").fill(word);
  }

  async typeNewCardRomanisation(text: string): Promise<void> {
    await this.page.getByTestId("new-card-romanisation").fill(text);
  }

  async newCardRomanisation(): Promise<string> {
    return await this.page.getByTestId("new-card-romanisation").inputValue();
  }

  async addCardError(): Promise<string> {
    return await this.page.getByTestId("new-card-error").innerText();
  }

  private rowOf(front: string): Locator {
    return this.page
      .getByTestId("browse-card")
      .filter({has: this.page.getByTestId("browse-card-front").getByText(front, {exact: true})});
  }

  async canDeleteCard(front: string): Promise<boolean> {
    return await this.rowOf(front).first().getByTestId("browse-card-delete").isVisible();
  }

  /** Deletes the learner's own card, both of its directions, asking twice as the app does, and waits until its row is gone. */
  async deleteCard(front: string): Promise<void> {
    const row = this.rowOf(front).first();

    await row.getByTestId("browse-card-delete").click();
    await row.getByTestId("browse-card-delete-confirm").click();
    await this.page
      .getByTestId("browse-card-front")
      .getByText(front, {exact: true})
      .first()
      .waitFor({state: "detached"});
  }

  async canEditCard(front: string): Promise<boolean> {
    return await this.rowOf(front).first().getByTestId("browse-card-edit").isVisible();
  }

  /** Opens the card's edit form, replaces its words, saves, and waits until the form closes or the reason it was refused shows. */
  async editCard(front: string, card: NewCardWords): Promise<void> {
    const row = this.rowOf(front).first();

    await row.getByTestId("browse-card-edit").click();
    await this.page.getByTestId("edit-card-word").fill(card.word);
    await this.page.getByTestId("edit-card-meaning").fill(card.meaning);
    if (card.romanisation !== undefined) {
      await this.page.getByTestId("edit-card-romanisation").fill(card.romanisation);
    }

    await this.page.getByTestId("browse-card-edit-save").click();
    await this.page.waitForFunction(() => {
      const closed = document.querySelector('[data-testid="browse-card-edit-save"]') === null;
      const refused = document.querySelector('[data-testid="edit-card-error"]') !== null;

      return closed || refused;
    });
  }

  async editCardError(): Promise<string> {
    return await this.page.getByTestId("edit-card-error").innerText();
  }
}
