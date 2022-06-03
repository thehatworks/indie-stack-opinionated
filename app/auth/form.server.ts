import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { makeDomainFunction, InputError } from "domain-functions";

import { getUserId } from "./session.server";
import { createUser, getUserByEmail, verifyLogin } from "~/models/user.server";
import { AuthInputSchema } from "./form.schema";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/");
  }

  return json({});
};

export const userCreationMutation = makeDomainFunction(AuthInputSchema)(
  async ({ email, password, redirectTo, remember }) => {
    if (await getUserByEmail(email)) {
      throw new InputError("A user already exists with this email", "email");
    }

    const { id } = await createUser(email, password);
    return { id, redirectTo, remember: remember ?? false };
  }
);

export const userLoginMutation = makeDomainFunction(AuthInputSchema)(
  async ({ email, password, redirectTo, remember }) => {
    const user = await verifyLogin(email, password);
    if (user === null) {
      throw new InputError("Invalid Email or Password", "email");
    }
    return { id: user.id, redirectTo, remember: remember ?? false };
  }
);
