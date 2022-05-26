import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/auth/session.server";
import { validateEmail, validatePassword } from "~/auth/validation";
import { safeRedirect } from "~/auth/session.component";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors: {
    email?: string | null;
    password?: string | null;
  };
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/notes");
  const remember = formData.get("remember");

  let errors = validateEmail(email);
  if (errors.length > 0) {
    return json<ActionData>({ errors: { email: errors[0] } }, { status: 400 });
  }

  errors = validatePassword(password);
  if (errors.length > 0) {
    return json<ActionData>(
      { errors: { password: errors[0] } },
      { status: 400 }
    );
  }

  const user = await verifyLogin(email!, password!);

  if (!user) {
    return json<ActionData>(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 }
    );
  }

  return createUserSession({
    redirectTo,
    remember: remember === "on" ? true : false,
    request,
    userId: user.id,
  });
};

export const meta: V2_MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/notes";
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-neutral block text-sm font-medium"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                ref={emailRef}
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="input input-bordered w-full border-neutral"
              />
              {actionData?.errors?.email && (
                <div className="pt-1 text-error" id="email-error">
                  {actionData.errors.email}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="input input-bordered border-neutral w-full"
              />
              {actionData?.errors?.password ? (
                <div className="pt-1 text-error" id="password-error">
                  {actionData.errors.password}
                </div>
              ) : null}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button type="submit" className="btn btn-primary w-full">
            Log in
          </button>
          <div className="flex items-center justify-between min-h-6">
            <div className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                className="checkbox checkbox-primary"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-neutral"
              >
                Remember me
              </label>
            </div>
            <div className="text-center text-sm text-neutral">
              Don't have an account?{" "}
              <Link
                className="link link-primary"
                to={{
                  pathname: "/join",
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
