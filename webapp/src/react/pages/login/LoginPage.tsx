import {loadAccountAndSync} from "@src/react/audio/sync/LoadAccountAndSync";
import {signIn} from "@src/redux/slices/account/actions/sign-in/thunks/SignIn";
import type {LoginReason} from "@src/react/pages/login/types/LoginReason";
import {useAppDispatch, useAppStore} from "@src/redux/shared/Hooks";

interface Props {
  readonly reason: LoginReason;
}

/** All there is to see until the learner has signed in with Google: the whole app is behind it. */
export function LoginPage({reason}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const store = useAppStore();

  return (
    <main
      data-testid="login-screen"
      className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-6 p-6 text-center"
    >
      <h1 data-testid="app-title" className="text-3xl font-semibold">
        Flash Cards
      </h1>

      {reason === "signIn" && (
        <>
          <p className="text-ink-muted">Sign in with Google to open the app.</p>

          <button
            type="button"
            data-testid="sign-in"
            onClick={() => dispatch(signIn())}
            className="rounded-xl bg-accent px-6 py-4 text-lg font-semibold text-ground"
          >
            Sign in with Google
          </button>
        </>
      )}

      {reason === "unreachable" && (
        <>
          <p data-testid="login-unreachable" className="text-ink-muted">
            Sign-in could not be reached. Check your connection, then try again.
          </p>

          <button
            type="button"
            data-testid="retry-sign-in"
            onClick={() => void loadAccountAndSync(store)}
            className="rounded-xl bg-accent px-6 py-4 text-lg font-semibold text-ground"
          >
            Try again
          </button>
        </>
      )}
    </main>
  );
}
