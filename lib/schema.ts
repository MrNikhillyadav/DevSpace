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
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required").max(5000, "Content is too long"),
  slug : z.string()
});

export type CreateNewBlogSchemaValues = z.infer<typeof newBlogSchema>;
