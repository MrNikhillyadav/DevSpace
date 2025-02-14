"use client";

import LoadingButton from "@/components/LoadingButton";
import RichTextEditor from "@/components/RichTextEditor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateNewBlogSchemaValues,newBlogSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { draftToMarkdown } from "markdown-draft-js";
import { useForm } from "react-hook-form";
import {publishNewBlogPost}  from "./action";

export default function PublishNewBlog() {
  const form = useForm<CreateNewBlogSchemaValues>({
    resolver: zodResolver(newBlogSchema),
  });

  const {
    handleSubmit,
    watch,
    trigger,
    control,
    setValue,
    setFocus,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: CreateNewBlogSchemaValues) {
    const formData = new FormData();
  
    Object.entries(values).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === "object" && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else if (value) {
        formData.append(key, value.toString());
      }
    });
  
    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  
    try {
      await publishNewBlogPost(formData);
    } catch (error) {
      alert("Something went wrong, please try again.");
    }
  }
  

  return (
    <main className="m-auto my-6 max-w-4xl space-y-10">
      <div className="space-y-6 rounded-lg  p-4">
        <Form {...form}>
          <form
            className="space-y-4"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Article Title ...." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* // TODO: ADD BLOG BANNER HERE
            <FormField
              control={control}
              name="companyLogo"
              render={({ field: { value, ...fieldValues } }) => (
                <FormItem>
                  <FormLabel>Company logo</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldValues}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        fieldValues.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
           
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Label onClick={() => setFocus("description")}>
                    Description
                  </Label>
                  <FormControl>
                    <RichTextEditor
                      onChange={(draft) =>
                        field.onChange(draftToMarkdown(draft))
                      }
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={isSubmitting}>
              Publish
            </LoadingButton>
          </form>
        </Form>
      </div>
    </main>
  );
}