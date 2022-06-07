import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { createNote } from "~/models/note.server";
import { requireUserId } from "~/auth/session.server";

import { NoteModel } from "~/../prisma/zod";
import { makeDomainFunction } from "remix-domains";
import { Form, performMutation } from "remix-forms";

const NoteInputSchema = NoteModel.pick({
  title: true,
  body: true,
});

const createNoteMutation = makeDomainFunction(NoteInputSchema)(
  async ({ title, body }) => await createNote({ title, body, userId })
);

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const result = await performMutation({
    request,
    schema: NoteInputSchema,
    mutation: createNoteMutation,
  });
  if (!result.success) {
    return json(result, 400);
  }

  const { id } = result.data;
  return redirect(`/notes/${id}`);
};

export default function NewNotePage() {
  return (
    <Form<typeof NoteInputSchema>
      schema={NoteInputSchema}
      className="base-form"
    >
      {({ Field, Errors, Button, register }) => (
        <>
          <Field name="title">
            {({ Label, Errors, SmartInput }) => (
              <>
                <Label />
                <SmartInput autoFocus={true} />
                <Errors className="form-error" />
              </>
            )}
          </Field>
          <Field name="body">
            {({ Label, Errors }) => (
              <>
                <Label />
                <textarea {...register("body")} />
                <Errors className="form-error" />
              </>
            )}
          </Field>
          <Errors className="form-error" />
          <Button>Save</Button>
        </>
      )}
    </Form>
  );
}

/* <div className="form-control">
<label className="label flex w-full flex-col gap-1">
  <span className="label-text">Title: </span>
  <input
    ref={titleRef}
    name="title"
    className="input input-bordered flex-1 text-lg leading-loose"
    aria-invalid={actionData?.errors?.title ? true : undefined}
    aria-errormessage={
      actionData?.errors?.title ? "title-error" : undefined
    }
  />
</label>

</div>

<div className="form-control">
<label className="label flex w-full flex-col gap-1">
  <span className="label-text">Body: </span>
  <textarea
    ref={bodyRef}
    name="body"
    rows={8}
    className="textarea textarea-bordered border-neutral w-full flex-1"
    aria-invalid={actionData?.errors?.body ? true : undefined}
    aria-errormessage={
      actionData?.errors?.body ? "body-error" : undefined
    }
  />
</label>

</div>

<div className="text-right">

</div> */
