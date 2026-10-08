import type {ReminderRequest} from "@src/redux/api/reminders/types/ReminderRequest";

/** The push service and the API's reminders, in memory for a test: whether the learner allows notifications, and what the API was told. */
export class FakeReminders {
  /** Whether the learner says yes when asked to allow notifications. */
  allowed = true;
  /** Whether the API can be reached. */
  unreachable = false;
  /** The address this device is subscribed at, if it is. */
  subscribedEndpoint: string | undefined;
  /** The study days the app told the API the goal was reached on. */
  readonly goalMetDays: string[] = [];
  /** What the API holds for this device, if anything. */
  held: ReminderRequest | undefined;

  async subscribe(): Promise<string | undefined> {
    this.throwIfUnreachable();

    if (!this.allowed) {
      return undefined;
    }

    this.subscribedEndpoint = "https://push.example.test/send/test-device";

    return this.subscribedEndpoint;
  }

  async unsubscribe(): Promise<string | undefined> {
    const endpoint = this.subscribedEndpoint;

    this.subscribedEndpoint = undefined;

    return endpoint;
  }

  async save(reminder: ReminderRequest): Promise<void> {
    this.throwIfUnreachable();
    this.held = reminder;
  }

  async remove(endpoint: string): Promise<void> {
    this.throwIfUnreachable();

    if (this.held?.endpoint === endpoint) {
      this.held = undefined;
    }
  }

  async reportGoalMet(studyDay: string): Promise<void> {
    this.throwIfUnreachable();
    this.goalMetDays.push(studyDay);
  }

  private throwIfUnreachable(): void {
    if (this.unreachable) {
      throw new Error("The API cannot be reached.");
    }
  }
}
