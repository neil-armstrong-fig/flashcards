import {useNavigate} from "react-router";
import {ROUTES} from "@src/react/routes/Routes";
import {endSession} from "@src/redux/slices/study/actions/session/thunks/EndSession";
import {useAppDispatch} from "@src/redux/shared/Hooks";

/** Ends the session and goes to the home screen. Answers already given are kept. */
export function useLeaveSession(): () => void {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return function leaveSession(): void {
    dispatch(endSession());
    void navigate(ROUTES.home);
  };
}
