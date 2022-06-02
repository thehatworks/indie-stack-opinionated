import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/auth/session.server";
import { useUser } from "~/auth/session.component";
import { getNoteListItems } from "~/models/note.server";
import { LogoutIcon } from "@heroicons/react/outline";

type LoaderData = {
  noteListItems: Awaited<ReturnType<typeof getNoteListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json<LoaderData>({ noteListItems });
};

export default function NotesPage() {
  const data = useLoaderData<LoaderData>();
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <nav className="navbar bg-primary">
        <div className="navbar-start mx-2 px-2">
          <h1 className="text-3xl font-bold">
            <Link to=".">Notes</Link>
          </h1>
        </div>
        <div className="navbar-center mx-2 px-2">{user.email}</div>
        <div className="navbar-end mx-2 px-2">
          <Form action="/logout" method="post">
            <button type="submit" className="btn btn-neutral btn-icon">
              <LogoutIcon />
              Logout
            </button>
          </Form>
        </div>
      </nav>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="text-secondary block p-4 text-xl">
            + New Note
          </Link>

          <hr />

          {data.noteListItems.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol>
              {data.noteListItems.map((note) => (
                <li key={note.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={note.id}
                  >
                    📝 {note.title}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
