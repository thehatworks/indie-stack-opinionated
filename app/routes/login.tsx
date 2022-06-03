import type { MetaFunction } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useSearchParams } from "@remix-run/react";

import { Form, performMutation } from "remix-forms";
import type { FormProps } from "remix-forms";

import { createUserSession } from "~/auth/session.server";

import { userLoginMutation } from "~/auth/form.server";
import { AuthInputSchema } from "~/auth/form.schema";

export { loader } from "~/auth/form.server";

export const meta: MetaFunction = () => ({
  title: "Login",
});

export const action: ActionFunction = async ({ request }) => {
  const result = await performMutation({
    request,
    schema: AuthInputSchema,
    mutation: userLoginMutation,
  });
  if (!result.success) {
    return json(result, 400);
  }
  const { redirectTo, id: userId } = result.data;
  return createUserSession({
    request,
    userId,
    remember: result.data.remember ?? false,
    redirectTo,
  });
};

const AuthInputForm = (props: FormProps<typeof AuthInputSchema>) => {
  return <Form<typeof AuthInputSchema> {...props} />;
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <AuthInputForm
          className="base-form"
          schema={AuthInputSchema}
          hiddenFields={["redirectTo"]}
          values={{ redirectTo }}
        >
          {({ Field, Errors, Button, register }) => (
            <>
              <Field name="email">
                {({ Label, Errors }) => (
                  <>
                    <Label />
                    <input
                      autoFocus={true}
                      autoComplete="email"
                      {...register("email")}
                    />
                    <Errors className="form-error" />
                  </>
                )}
              </Field>
              <Field name="password">
                {({ Label, Errors }) => (
                  <>
                    <Label />
                    <input
                      type="password"
                      autoComplete="new-password"
                      {...register("password")}
                    />
                    <Errors className="form-error" />
                  </>
                )}
              </Field>
              <Field name="redirectTo" />
              <Errors />
              <Button>Log In</Button>
              <div className="flex h-6 flex-row justify-between">
                <Field className="flex flex-row" name="remember">
                  {({ Label, SmartInput }) => (
                    <>
                      <SmartInput />
                      <Label>Remember Me</Label>
                    </>
                  )}
                </Field>
                <div className="text-neutral flex flex-row text-sm">
                  Don't have an account?
                  <Link
                    className="link link-primary ml-1"
                    to={{
                      pathname: "/join",
                      search: searchParams.toString(),
                    }}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </>
          )}
        </AuthInputForm>
      </div>
    </div>
  );
}
