/** What a device sent as the study day the goal was reached on: a real date, `YYYY-MM-DD`; otherwise nothing. */
export function studyDayFrom(body: unknown): string | undefined {
  if (typeof body !== "object" || body === null || !("studyDay" in body) || typeof body.studyDay !== "string") {
    return undefined;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.studyDay) || Number.isNaN(Date.parse(body.studyDay))) {
    return undefined;
  }

  return body.studyDay;
}
