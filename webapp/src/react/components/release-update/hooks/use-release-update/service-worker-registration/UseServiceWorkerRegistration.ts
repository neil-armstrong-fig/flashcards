/** The PWA plugin's own hook: it registers the worker and says when a new release is waiting. It exists only in a build. */
export {useRegisterSW as useServiceWorkerRegistration} from "virtual:pwa-register/react";
