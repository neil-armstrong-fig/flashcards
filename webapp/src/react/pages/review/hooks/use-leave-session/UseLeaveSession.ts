import {useNavigate} from "react-router";

/** Leaves the session by returning to the screen that started it. The review page ends the session as it unmounts. */
export function useLeaveSession(): () => void {
  const navigate = useNavigate();

  return function leaveSession(): void {
    void navigate(-1);
  };
}
