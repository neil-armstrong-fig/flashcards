import {selectCurrentSimilars} from "@src/redux/slices/similar/selectors/SelectCurrentSimilars";
import {useAppSelector} from "@src/redux/shared/Hooks";

/** Warns which characters the one on screen is easily taken for, with their sounds, so they can be told apart. Nothing when none is. */
export function ShapeSimilarsWarning(): React.JSX.Element | undefined {
  const alikes = useAppSelector(state => selectCurrentSimilars(state).shape);

  if (alikes.length === 0) {
    return undefined;
  }

  return (
    <div className="flex flex-col items-center gap-1 text-sm text-ink-muted">
      <p>Easily mixed up with</p>

      <ul className="flex gap-4">
        {alikes.map(alike => (
          <li key={alike.character} data-testid="shape-similar" className="text-lg">
            {alike.character} {alike.sound}
          </li>
        ))}
      </ul>
    </div>
  );
}
