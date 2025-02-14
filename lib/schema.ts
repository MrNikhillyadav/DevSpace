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

