import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useSearchParams } from "@remix-run/react";

import { performMutation } from "remix-forms";
import type { FormProps } from "remix-forms";

import { Form } from "~/forms/form";

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

const AuthInputForm = (props: FormProps<typeof AuthInputSchema>) => {
  return <Form<typeof AuthInputSchema> {...props} />;
};

export default function JoinPage() {
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
              <Button>Create Account</Button>
            </>
          )}
        </AuthInputForm>
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
