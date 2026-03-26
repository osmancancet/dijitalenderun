import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except:
    // - /api, /admin, /_next, /images, static files
    "/((?!api|admin|_next|images|favicon.ico|.*\\..*).*)",
  ],
};
