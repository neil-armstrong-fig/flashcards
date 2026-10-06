import type {Page} from "@playwright/test";
import {BaseComponent} from "@src/dsl/playwright/BaseComponent";

/** A one-pixel PNG: all the specs need is a file the browser can decode. */
const A_PICTURE = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

export class MemoryAidPlaywright extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  async addPicture(): Promise<void> {
    await this.page
      .getByTestId("picture-input")
      .setInputFiles({name: "mule.png", mimeType: "image/png", buffer: A_PICTURE});
    await this.page.getByTestId("picture").waitFor();
  }

  async pastePicture(): Promise<void> {
    await this.page.getByTestId("card-front").waitFor();
    await this.page.evaluate(async base64 => {
      const bytes = Uint8Array.from(atob(base64), character => character.charCodeAt(0));
      const data = new DataTransfer();
      data.items.add(new File([bytes], "pasted.png", {type: "image/png"}));
      document.dispatchEvent(new ClipboardEvent("paste", {clipboardData: data, bubbles: true}));
    }, A_PICTURE.toString("base64"));
    await this.page.getByTestId("picture").waitFor();
  }

  async addTextFileAsPicture(): Promise<void> {
    await this.page
      .getByTestId("picture-input")
      .setInputFiles({name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("not a picture")});
    await this.page.getByTestId("picture-error").waitFor();
  }

  async removePicture(): Promise<void> {
    await this.page.getByTestId("picture-remove").click();
    await this.page.getByTestId("picture").waitFor({state: "detached"});
  }

  async pictureShown(): Promise<boolean> {
    await this.page.getByTestId("card-front").waitFor();
    await this.page.getByTestId("picture-input").waitFor({state: "attached"});
    const picture = this.page.getByTestId("picture");

    if ((await picture.count()) === 0) {
      return false;
    }

    await picture.evaluate(async image => {
      await (image as HTMLImageElement).decode().catch(() => undefined);
    });

    return await picture.evaluate(image => (image as HTMLImageElement).naturalWidth > 0);
  }

  async pictureError(): Promise<string | undefined> {
    const error = this.page.getByTestId("picture-error");

    if (!(await error.isVisible())) {
      return undefined;
    }

    return await error.innerText();
  }

  async removeTheAids(): Promise<void> {
    await this.page.getByTestId("fade-remove").click();
    await this.page.getByTestId("fade-offer").waitFor({state: "detached"});
  }

  async keepTheAids(): Promise<void> {
    await this.page.getByTestId("fade-keep").click();
    await this.page.getByTestId("fade-offer").waitFor({state: "detached"});
  }

  async removingTheAidsOffered(): Promise<boolean> {
    await this.page.getByTestId("card-front").waitFor();
    await this.page.getByTestId("picture-input").waitFor({state: "attached"});

    return (await this.page.getByTestId("fade-offer").count()) > 0;
  }

  async promptedToAddAMemoryAid(): Promise<boolean> {
    await this.page.getByTestId("card-front").waitFor();
    await this.page.getByTestId("picture-input").waitFor({state: "attached"});

    return (await this.page.getByTestId("aid-prompt").count()) > 0;
  }

  async addNote(text: string): Promise<void> {
    await this.page.getByTestId("note-add").click();
    await this.page.getByTestId("note-input").fill(text);
    await this.page.getByTestId("note-save").click();
    await this.page.getByTestId("note-text").waitFor();
  }

  async removeNote(): Promise<void> {
    await this.page.getByTestId("note-remove").click();
    await this.page.getByTestId("note-add").waitFor();
  }

  async note(): Promise<string | undefined> {
    await this.page.getByTestId("card-front").waitFor();
    const note = this.page.getByTestId("note-text");

    if (!(await note.isVisible())) {
      return undefined;
    }

    return await note.innerText();
  }
}
