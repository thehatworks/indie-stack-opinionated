import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useSearchParams } from "@remix-run/react";

import { performMutation } from "remix-forms";

import { Form } from "~/forms/form";
import { FormError } from "~/forms/components";

import { createUserSession } from "~/auth/session.server";
import { userCreationMutation } from "~/auth/form.server";
import { AuthInputSchema } from "~/auth/form.schema";

export { loader } from "~/auth/form.server";

export const meta: V2_MetaFunction = () => [{ title: "Sign Up" }];

export const action = async ({ request }: ActionArgs) => {
  const result = await performMutation({
    request,
    schema: AuthInputSchema,
    mutation: userCreationMutation,
  });
  if (!result.success) {
    return json(result, 400);
  }
  const { redirectTo, id, remember } = result.data;
  return createUserSession({
    redirectTo,
    remember,
    request,
    userId: id,
  });
};

export default function JoinPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form<typeof AuthInputSchema>
          className="base-form"
          schema={AuthInputSchema}
          hiddenFields={["redirectTo"]}
          values={{ redirectTo }}
          errorComponent={FormError}
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
                    <Errors />
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
                    <Errors />
                  </>
                )}
              </Field>
              <Field name="redirectTo" />
              <Errors />
              <Button>Create Account</Button>
            </>
          )}
        </Form>
        <div className="justify-right items-right mt-6 flex h-6">
          <div className="text-neutral grow text-right text-sm">
            Already have an account?
            <Link
              className="link link-primary ml-1"
              to={{
                pathname: "/login",
                search: searchParams.toString(),
              }}
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
