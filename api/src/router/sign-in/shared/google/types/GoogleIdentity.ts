/** Who Google says the person is: its stable id for them, and the email it holds, with whether it has checked the email. */
export interface GoogleIdentity {
  readonly subject: string;
  readonly email: string | undefined;
  readonly emailVerified: boolean;
}
