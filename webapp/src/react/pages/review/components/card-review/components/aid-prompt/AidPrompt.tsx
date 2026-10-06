import {selectIsAidPrompted} from "@src/redux/shared/memory-aids/SelectIsAidPrompted";
import {useAppSelector} from "@src/redux/shared/Hooks";

/** Asks for a note or a picture on a card the learner keeps struggling with: a memory aid is the help that card needs most. */
export function AidPrompt(): React.JSX.Element | undefined {
  const prompted = useAppSelector(selectIsAidPrompted);

  if (!prompted) {
    return undefined;
  }

  return (
    <p data-testid="aid-prompt" className="text-center text-sm text-accent">
      This card is giving you trouble. Add a note or a picture to help you remember it.
    </p>
  );
}
