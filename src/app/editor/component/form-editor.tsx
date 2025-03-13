"use client";

import { InputEditor, InputEditorRef } from "@/components/input-editor";
import { InputImages, InputImagesRef } from "@/components/input-images";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axios";
import { formData } from "@/lib/form-data";
import { postSchema } from "@/lib/schemas/post-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormEditor: FC = () => {
  const inputImagesRef = useRef<InputImagesRef>(null);
  const inputEditorRef = useRef<InputEditorRef>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "My text post",
      images: [],
      content: "Something to describe!",
    },
  });

  function handlerResetForm() {
    form.reset(); // Reset the form
    inputImagesRef.current?.reset(); // Reset InputImages
    inputEditorRef.current?.reset()
  }

  function onSubmit(values: z.infer<typeof postSchema>) {
    startTransition(() => {
      const data = formData(values);

      axiosInstance.post("/api/post", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(() => {
          toast.success("The post was successfully created");
        })
        .catch((err) => {
          toast.error(err.message);
        });
    });
  }

  return (
    <div className="p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Title post"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <InputImages
                      ref={inputImagesRef}
                      disabled={isPending}
                      images={field.value}
                      onChange={(files: File[]) => field.onChange(files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <InputEditor
                      ref={inputEditorRef}
                      content={form.watch("content")}
                      onChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-x-6">
              <Button
                type="reset"
                variant="secondary"
                disabled={isPending}
                onClick={handlerResetForm}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isPending}
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export { FormEditor };