"use client"

import { FC, useEffect, useTransition } from "react";
import { UserDtoType } from "../../../../dto/user.dto";
import { usePfofileStore } from "@/lib/store/use-pfofile-store";
import { profileSchema } from "@/lib/schemas/profile-schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormUserProps {
  profile: UserDtoType
}

const FormUser: FC<FormUserProps> = (props) => {
  const [isPending, startTransition] = useTransition()
  const { profile, setValue, setProfile } = usePfofileStore();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      _id: "",
      name: "",
      email: "",
      avatar: "",
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    if (!profile._id) {
      setProfile(props.profile)
      form.reset({
        _id: props.profile?._id,
        name: props.profile?.name || "",
        email: props.profile?.email || "",
        avatar: props.profile?.avatar || "",
        password: "",
        newPassword: "",
        confirmPassword: "",
      })
    } else {
      form.reset({
        _id: profile._id,
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar,
        password: profile.password,
        newPassword: profile.newPassword,
        confirmPassword: profile.confirmPassword,
      })
    }
  }, [props.profile, setProfile, form])

  if (!profile._id) {
    return <div>Loading...</div>;
  }


  function onSubmit(values: z.infer<typeof profileSchema>) {
    startTransition(() => {
      console.log(values)
    })
  }

  return (
    <Card
      className="w-full max-w-md"
    >
      <CardHeader>
        <CardTitle
          className="text-xl text-center"
        >
          My profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col">
            <div
              className="flex flex-col gap-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isPending}
                        placeholder="Your name"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setValue({ field: "name", value: e.target.value });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="Email"
                        disabled={isPending}
                        placeholder="Your email"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setValue({ field: "email", value: e.target.value });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("avatar") && (
                  <img
                    src={URL.createObjectURL(form.watch("avatar"))}
                    alt="Avatar Preview"
                    className="w-24 h-24 rounded-full"
                  />
                )}
                {/* {form.watch("avatar") instanceof File ? (
                  <img
                    src={URL.createObjectURL(form.watch("avatar"))}
                    alt="Avatar Preview"
                    className="w-24 h-24 rounded-full"
                  />
                ) : typeof form.watch("avatar") === "string" ? (
                  <img
                    src={form.watch("avatar") ?? ""}
                    alt="Existing Avatar"
                    className="w-24 h-24 rounded-full"
                  />
                ) : null} */}
              </div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={isPending}
                        placeholder="Your old password"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setValue({ field: "password", value: e.target.value });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={isPending}
                        placeholder="Your new password"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setValue({ field: "newPassword", value: e.target.value });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm new password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={isPending}
                        placeholder="Confirm your new password"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setValue({ field: "confirmPassword", value: e.target.value });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>

  )
}

export { FormUser }