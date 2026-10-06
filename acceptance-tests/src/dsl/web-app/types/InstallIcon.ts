/** One icon the app says it can wear on a home screen, and whether the address it gave really serves a picture. */
export interface InstallIcon {
  readonly sizes: string;
  readonly type: string;
  readonly purpose: string;
  readonly loads: boolean;
}
