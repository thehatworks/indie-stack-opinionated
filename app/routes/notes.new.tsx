import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { performMutation } from "remix-forms";
import { makeDomainFunction } from "domain-functions";

import { Form } from "~/forms/form";
import { FormError } from "~/forms/components";

import { createNote } from "~/models/note.server";
import { requireUserId } from "~/auth/session.server";
import { AuthorizedMutationEnvironmentSchema } from "~/auth/form.schema";

import { NoteModel } from "~/zod";

// TODO: there has to be a good way to get userId directly
// from UserModel["id"].. something to do with transform..
const NoteMutationSchema = NoteModel.pick({
  title: true,
  body: true,
});

const createNoteMutation = makeDomainFunction(
  NoteMutationSchema,
  AuthorizedMutationEnvironmentSchema
)(
  async ({ title, body }, { userId }) =>
    await createNote({ title, body, userId })
);

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const result = await performMutation({
    request,
    schema: NoteMutationSchema,
    mutation: createNoteMutation,
    environment: { userId },
  });
  if (!result.success) {
    return json(result, 400);
  }

  const { id: noteId } = result.data;
  return redirect(`/notes/${noteId}`);
};

export default function NewNotePage() {
  return (
    <Form<typeof NoteMutationSchema>
      schema={NoteMutationSchema}
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
