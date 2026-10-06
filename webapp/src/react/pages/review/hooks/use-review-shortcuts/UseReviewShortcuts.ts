import {selectLookingAhead} from "@src/redux/slices/study/selectors/SelectLookingAhead";
import {useEffect} from "react";
import {answerCard} from "@src/redux/slices/study/actions/answering/thunks/AnswerCard";
import {nextPreviewCard} from "@src/redux/slices/study/actions/answering/thunks/NextPreviewCard";
import {setCardAside} from "@src/redux/slices/study/actions/setting-aside/thunks/SetCardAside";
import {shortcutFor} from "@src/react/pages/review/hooks/use-review-shortcuts/shortcut-for/ShortcutFor";
import {showAnswer} from "@src/redux/slices/study/actions/answering/thunks/ShowAnswer";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/** Lets the review screen be driven from the keyboard. Keys held with a modifier are left to the browser. */
export function useReviewShortcuts(): void {
  const dispatch = useAppDispatch();
  const hasCard = useAppSelector(state => state.study.session?.currentCardId !== undefined);
  const answerShown = useAppSelector(state => state.study.session?.answerShown === true);
  const lookingAhead = useAppSelector(selectLookingAhead);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (event.ctrlKey || event.metaKey || event.altKey || isTypingTarget(event.target ?? undefined)) {
        return;
      }

      const shortcut = shortcutFor(event.key, {hasCard, answerShown, lookingAhead});

      if (!shortcut) {
        return;
      }

      event.preventDefault();

      if (shortcut.kind === "showAnswer") {
        dispatch(showAnswer());
      }

      if (shortcut.kind === "rate") {
        void dispatch(answerCard(shortcut.rating));
      }

      if (shortcut.kind === "next") {
        dispatch(nextPreviewCard());
      }

      if (shortcut.kind === "setAside") {
        void dispatch(setCardAside(shortcut.how));
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dispatch, hasCard, answerShown, lookingAhead]);
}

function isTypingTarget(target: EventTarget | undefined): boolean {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}
