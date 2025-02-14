import * as z from "zod";

export const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export const newBlogSchema = z.object({
  title: z.string(),
  content : z.string().max(5000).optional(),
})

export type CreateNewBlogSchemaValues = z.infer<typeof newBlogSchema>;




// model Post {
//   id        String   @id @default(cuid())
//   title     String
//   content   String   @db.Text
//   published Boolean  @default(false)
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   authorId  String
//   author    User     @relation(fields: [authorId], references: [id])
// }