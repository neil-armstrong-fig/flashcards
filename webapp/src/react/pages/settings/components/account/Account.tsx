import {signOutAndForgetRecordings} from "@src/react/audio/sign-out/SignOutAndForgetRecordings";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/**
 * Who is signed in, and a way to sign out, which closes the app to them again. Signing in is on the sign-in screen, since the whole
 * app is behind it. Shown only while signed in: on a device that is open offline from an earlier sign-in, nobody can be signed out.
 */
export function Account(): React.JSX.Element | undefined {
  const dispatch = useAppDispatch();
  const status = useAppSelector(state => state.account.status);
  const email = useAppSelector(state => state.account.email);

  if (status !== "signedIn") {
    return undefined;
  }

  return (
    <section data-testid="account" className="flex flex-col gap-3 rounded-xl bg-ground-raised p-4">
      <h2 className="font-semibold">Account</h2>

      <div data-testid="signed-in" className="flex items-center justify-between gap-3">
        <span className="min-w-0 truncate text-sm">
          Signed in as <span data-testid="signed-in-email">{email}</span>
        </span>

        <button
          type="button"
          data-testid="sign-out"
          onClick={() => void signOutAndForgetRecordings(dispatch)}
          className="rounded-xl bg-ground px-4 py-2 text-sm font-semibold"
        >
          Sign out
        </button>
      </div>
    </section>
  );
}
