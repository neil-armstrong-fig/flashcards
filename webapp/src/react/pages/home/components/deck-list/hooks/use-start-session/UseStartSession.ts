import {useNavigate} from "react-router";
import {ROUTES} from "@src/react/routes/Routes";
import {startSession} from "@src/redux/slices/study/actions/session/thunks/StartSession";
import {useAppDispatch} from "@src/redux/shared/Hooks";
import type {StudyFocus} from "@flashcards/shared/study/StudyFocus";

type StartSession = (deckId: string, focus?: StudyFocus) => void;

/** Starts a session and adds its screen to browser history, so Back returns to the home screen. */
export function useStartSession(): StartSession {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return function start(deckId: string, focus: StudyFocus = "all"): void {
    dispatch(startSession(deckId, focus));
    void navigate(ROUTES.review);
  };
}
