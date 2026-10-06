import {keepMemoryAids} from "@src/redux/shared/memory-aids/actions/memory-aid/thunks/KeepMemoryAids";
import {removeMemoryAids} from "@src/redux/shared/memory-aids/actions/memory-aid/thunks/RemoveMemoryAids";
import {selectIsFadeOffered} from "@src/redux/shared/memory-aids/SelectIsFadeOffered";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/** Offers to take the note and picture off a card the learner now answers well: a memory aid is there to be outgrown. */
export function FadeOffer(): React.JSX.Element | undefined {
  const dispatch = useAppDispatch();
  const offered = useAppSelector(selectIsFadeOffered);

  if (!offered) {
    return undefined;
  }

  return (
    <div data-testid="fade-offer" className="flex flex-col items-center gap-2 text-sm">
      <p className="text-ink-muted">You know this one now. Take off your note and picture?</p>

      <div className="flex gap-4">
        <button
          type="button"
          data-testid="fade-remove"
          onClick={() => void dispatch(removeMemoryAids())}
          className="underline"
        >
          Remove them
        </button>

        <button
          type="button"
          data-testid="fade-keep"
          onClick={() => void dispatch(keepMemoryAids())}
          className="text-ink-muted underline"
        >
          Keep them
        </button>
      </div>
    </div>
  );
}
