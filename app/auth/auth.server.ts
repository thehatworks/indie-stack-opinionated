import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { sessionStorage } from "~/auth/implementation.server";
import { verifyLogin } from "~/models/user.server";
import type { User } from "~/models/user.server";

export const sessionErrorKey = "__sessionError";
const authenticator = new Authenticator<User["id"] | null>(
  sessionStorage, { sessionErrorKey }
);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const user = await verifyLogin(email, password);
    return user ? user.id : null;
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  "local-form-strategy"
);

export { authenticator, AuthorizationError };
