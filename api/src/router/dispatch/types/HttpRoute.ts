import type {HTTP_ROUTES} from "@src/router/dispatch/HttpRoutes";

export type HttpRoute = (typeof HTTP_ROUTES)[number];
