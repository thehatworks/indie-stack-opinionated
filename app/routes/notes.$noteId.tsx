import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import type { Note } from "~/models/note.server";
import { deleteNote, getNote } from "~/models/note.server";
import { requireUserId } from "~/auth/session.server";

type LoaderData = {
  note: Pick<Note, "id" | "title" | "body">;
};

export const loader = async ({ params, request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  const note = await getNote({ id: params.noteId, userId });
  if (note == null) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ note });
};

export const action = async ({ params, request }: ActionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  await deleteNote({ id: params.noteId, userId });

  return redirect("/notes");
};

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex w-full flex-col">
      <div className="card bg-base-300 rounded-box grid gap-6 p-4">
        <h3 className="text-2xl font-bold">{data.note.title}</h3>
        <p>{data.note.body}</p>
      </div>
      <Form method="post">
        <button type="submit" className="btn btn-primary">
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Note not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
