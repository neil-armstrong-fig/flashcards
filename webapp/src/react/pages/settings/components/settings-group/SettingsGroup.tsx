import type {ReactNode} from "react";

interface Props {
  readonly title: string;
  readonly testId?: string;
  readonly children: ReactNode;
}

/**
 * One kind of setting in a frame of its own, with a heading in the accent colour, so that on a small screen, scrolling past a dozen
 * similar rows, the learner can tell which part of the settings they are in.
 */
export function SettingsGroup({title, testId, children}: Props): React.JSX.Element {
  return (
    <section
      aria-label={title}
      data-testid={testId}
      className="flex flex-col gap-3 rounded-2xl border-2 border-accent/40 p-4"
    >
      <h2 className="text-lg font-semibold text-accent">{title}</h2>

      {children}
    </section>
  );
}
