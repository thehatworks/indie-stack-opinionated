import * as z from "zod"
import { CompletePassword, RelatedPasswordModel, CompleteNote, RelatedNoteModel } from "./index"

export const UserModel = z.object({
  /**
   * The user's id
   * @default generated by prisma and cuid()
   */
  id: z.string(),
  /**
   * User's email address (unique key)
   */
  email: z.string().min(1, "Please Enter an Email Address").email("Please Use a Valid Email Address"),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  password?: CompletePassword | null
  notes: CompleteNote[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  /**
   * User's password as a foriegn key (traditional)
   */
  password: RelatedPasswordModel.nullish(),
  /**
   * User's associated notes from model Note
   */
  notes: RelatedNoteModel.array(),
}))