import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { createNote } from "~/models/note.server";
import { requireUserId } from "~/auth/session.server";

import { NoteModel } from "~/zod";
import { makeDomainFunction } from "remix-domains";
import { Form, performMutation } from "remix-forms";
import { AuthorizedMutationEnvironmentSchema } from "~/auth/form.schema";

const NoteInputSchema = NoteModel.pick({
  title: true,
  body: true,
});

const createNoteMutation = makeDomainFunction(
  NoteInputSchema,
  AuthorizedMutationEnvironmentSchema
)(
  async ({ title, body }, { userId }) =>
    await createNote({ title, body, userId })
);

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const result = await performMutation({
    request,
    schema: NoteInputSchema,
    mutation: createNoteMutation,
    environment: { userId },
  });
  if (!result.success) {
    return json(result, 400);
  }

  const { id } = result.data;
  return redirect(`/notes/${id}`);
};

const FormError = (props: JSX.IntrinsicElements["div"]) => {
  return <div className="form-error" {...props} />;
};

export default function NewNotePage() {
  return (
    <Form<typeof NoteInputSchema>
      schema={NoteInputSchema}
      className="base-form"
      multiline={["body"]}
      errorComponent={FormError}
    >
      {({ Field, Errors, Button, register }) => (
        <>
          <Field name="title">
            {({ Label, Errors, SmartInput }) => (
              <>
                <Label />
                <SmartInput autoFocus={true} />
                <Errors />
              </>
            )}
          </Field>
          <Field name="body">
            {({ Label, Errors }) => (
              <>
                <Label />
                <textarea rows={8} {...register("body")} />
                <Errors />
              </>
            )}
          </Field>
          <Errors />
          <Button>Save</Button>
        </>
      )}
    </Form>
  );
}
