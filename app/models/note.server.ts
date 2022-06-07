import type { UserData, Note } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Note } from "@prisma/client";

export const getNote = async ({
  id,
  userId,
}: Pick<Note, "id"> & Pick<UserData, "userId">) => {
  const data = await prisma.userData.findUnique({
    where: { userId },
    select: {
      notes: {
        where: {
          id,
        },
      },
    },
  });

  return data?.notes[0] ?? null;
};

export const getNoteListItems = async ({
  userId,
}: Pick<UserData, "userId">) => {
  const data = await prisma.userData.findUnique({
    where: { userId },
    include: {
      notes: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return data?.notes ?? [];
};

export const createNote = async ({
  body,
  title,
  userId,
}: Pick<Note, "body" | "title"> & Pick<UserData, "userId">) => {
  return await prisma.note.create({
    data: {
      title,
      body,
      data: {
        connect: {
          userId,
        },
      },
    },
  });
};

export const deleteNote = async ({
  id,
  userId,
}: Pick<Note, "id"> & Pick<UserData, "userId">) => {
  await prisma.userData.update({
    where: {
      userId,
    },
    data: {
      notes: {
        delete: {
          id,
        },
      },
    },
  });
};
