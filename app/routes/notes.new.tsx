import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { performMutation } from "remix-forms";
import { makeDomainFunction } from "domain-functions";

import { Form } from "~/forms/form";
import { createNote } from "~/models/note.server";
import { requireUserId } from "~/auth/session.server";

import { NoteModel } from "~/zod";
import { z } from "zod";

// TODO: there has to be a good way to get userId directly
// from UserModel["id"].. something to do with transform..
const NoteMutationSchema = NoteModel.pick({
  title: true,
  body: true,
}).merge(
  z.object({
    userId: z.string(),
  })
);

const createNoteMutation = makeDomainFunction(NoteMutationSchema)(createNote);

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  return json({ userId });
};

export const action = async ({ request }: ActionArgs) => {
  const result = await performMutation({
    request,
    schema: NoteMutationSchema,
    mutation: createNoteMutation,
  });
  if (!result.success) {
    return json(result, 400);
  }

  const { id: noteId } = result.data;
  return redirect(`/notes/${noteId}`);
};

export default function NewNotePage() {
  const { userId } = useLoaderData<typeof loader>();
  console.log(userId);
  return (
    <Form<typeof NoteMutationSchema>
      schema={NoteMutationSchema}
      className="base-form"
      hiddenFields={["userId"]}
      values={{ userId }}
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
          <Field name="userId" />
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
