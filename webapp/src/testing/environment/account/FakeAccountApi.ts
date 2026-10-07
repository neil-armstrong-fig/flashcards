/** The API's account side, in memory for a test: says who is signed in, and can be told to be unreachable. */
export class FakeAccountApi {
  email: string | undefined;
  unreachable = false;
  signInAsked = false;

  signIn(): void {
    this.signInAsked = true;
  }

  async readMe(): Promise<string | undefined> {
    this.throwIfUnreachable();

    return this.email;
  }

  async signOut(): Promise<void> {
    this.throwIfUnreachable();
    this.email = undefined;
  }

  private throwIfUnreachable(): void {
    if (this.unreachable) {
      throw new Error("The API cannot be reached.");
    }
  }
}
