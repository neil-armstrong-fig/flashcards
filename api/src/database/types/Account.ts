/** A signed-in person as the API knows them: who they are, and the email Google gave. Nothing else is kept. */
export interface Account {
  readonly id: string;
  readonly email: string;
}
