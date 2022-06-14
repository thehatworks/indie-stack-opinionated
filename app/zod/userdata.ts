import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteNote, RelatedNoteModel } from "./index"

export const UserDataModel = z.object({
  /**
   * Unique id for this data
   */
  id: z.string(),
  /**
   * id of associated user entry (foreign key)
   */
  userId: z.string(),
})

export interface CompleteUserData extends z.infer<typeof UserDataModel> {
  user: CompleteUser
  notes: CompleteNote[]
}

/**
 * RelatedUserDataModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserDataModel: z.ZodSchema<CompleteUserData> = z.lazy(() => UserDataModel.extend({
  /**
   * The actual user object tied to this data
   */
  user: RelatedUserModel,
  /**
   * User's associated notes from model Note
   */
  notes: RelatedNoteModel.array(),
}))
