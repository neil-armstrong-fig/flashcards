import {finishSignIn} from "@src/router/sign-in/finish-sign-in/FinishSignIn";
import {forSignedInAccount} from "@src/router/dispatch/sign-in-guard/ForSignedInAccount";
import {logOut} from "@src/router/routes/log-out/LogOut";
import {readMe} from "@src/router/routes/me/ReadMe";
import {serveRecordingForAccount} from "@src/router/routes/audio/ServeRecordingForAccount";
import {speakForAccount} from "@src/router/routes/speech/speak-for-account/SpeakForAccount";
import {syncCardEvents} from "@src/router/routes/sync/sync-card-events/SyncCardEvents";
import {keepPicture} from "@src/router/routes/pictures/keep-picture/KeepPicture";
import {servePicture} from "@src/router/routes/pictures/serve-picture/ServePicture";
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
    case "POST /api/sync":
      return forSignedInAccount(request, account => syncCardEvents(request, account));
    case "GET /api/pictures/*":
      return forSignedInAccount(request, account => servePicture(request, account));
    case "PUT /api/pictures/*":
      return forSignedInAccount(request, account => keepPicture(request, account));
    case "POST /api/speech":
      return forSignedInAccount(request, () => speakForAccount(request));
    case "GET /api/audio/*":
      return forSignedInAccount(request, () => serveRecordingForAccount(request));
  }
}
