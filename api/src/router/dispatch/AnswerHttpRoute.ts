import {addNote} from "@src/router/routes/notes/add-note/AddNote";
import {addToSimilar} from "@src/router/routes/similar/add-to-similar/AddToSimilar";
import {removeFromSimilar} from "@src/router/routes/similar/remove-from-similar/RemoveFromSimilar";
import {changeNote} from "@src/router/routes/notes/change-note/ChangeNote";
import {removeNote} from "@src/router/routes/notes/remove-note/RemoveNote";
import {finishSignIn} from "@src/router/sign-in/finish-sign-in/FinishSignIn";
import {forSignedInAccount} from "@src/router/dispatch/sign-in-guard/ForSignedInAccount";
import {logOut} from "@src/router/routes/log-out/LogOut";
import {readSimilar} from "@src/router/routes/similar/read-similar/ReadSimilar";
import {readMe} from "@src/router/routes/me/ReadMe";
import {readNotes} from "@src/router/routes/notes/read-notes/ReadNotes";
import {serveRecordingForAccount} from "@src/router/routes/audio/ServeRecordingForAccount";
import {speakForAccount} from "@src/router/routes/speech/speak-for-account/SpeakForAccount";
import {startSignIn} from "@src/router/sign-in/start-sign-in/StartSignIn";
import type {HttpRoute} from "@src/router/dispatch/types/HttpRoute";

/**
 * One route to one handler, each named in full: the whole of what the API answers over HTTP, in one place. The ones that are a
 * signed-in person's own go through `forSignedInAccount`, which hands them an account or answers 401. The speech is one of them: only
 * a signed-in account may spend the Azure allowance. A route added to `HTTP_ROUTES` with no case here is a compile error.
 */
export function answerHttpRoute(route: HttpRoute, request: Request): Promise<Response> {
  switch (route) {
    case "GET /api/auth/google":
      return startSignIn(request);
    case "GET /api/auth/google/callback":
      return finishSignIn(request);
    case "POST /api/auth/logout":
      return logOut(request);
    case "GET /api/me":
      return forSignedInAccount(request, account => Promise.resolve(readMe(account)));
    case "GET /api/similar":
      return forSignedInAccount(request, account => readSimilar(account));
    case "POST /api/similar":
      return forSignedInAccount(request, account => addToSimilar(request, account));
    case "DELETE /api/similar":
      return forSignedInAccount(request, account => removeFromSimilar(request, account));
    case "GET /api/notes":
      return forSignedInAccount(request, account => readNotes(account));
    case "POST /api/notes":
      return forSignedInAccount(request, account => addNote(request, account));
    case "PUT /api/notes":
      return forSignedInAccount(request, account => changeNote(request, account));
    case "DELETE /api/notes":
      return forSignedInAccount(request, account => removeNote(request, account));
    case "POST /api/speech":
      return forSignedInAccount(request, () => speakForAccount(request));
    case "GET /api/audio/*":
      return forSignedInAccount(request, () => serveRecordingForAccount(request));
  }
}
