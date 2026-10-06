import type {GoogleIdentity} from "@src/router/sign-in/shared/google/types/GoogleIdentity";

/** Google, standing in: it says who the person is, or refuses, as a test arranges. One instance, put back before each test. */
class TestGoogle {
  identity: GoogleIdentity = {subject: "google-1", email: "me@example.com", emailVerified: true};
  refuses = false;

  reset(): void {
    this.identity = {subject: "google-1", email: "me@example.com", emailVerified: true};
    this.refuses = false;
  }

  readonly identityOf = async (): Promise<GoogleIdentity> => {
    if (this.refuses) {
      throw new Error("Google refused the code.");
    }

    return this.identity;
  };
}

export const testGoogle = new TestGoogle();
