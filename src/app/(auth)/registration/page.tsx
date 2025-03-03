"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Routers } from "@/types/routers";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { registrationSchema } from "@/lib/schemas/registration-schema";
import { useRegistrationStore } from "@/lib/store/useRegistrationStore";
import { ChangeEvent } from "react";
import { signIn } from "next-auth/react";

export default function RegistrationPage() {
  const { changeValues, ...other } = useRegistrationStore();
  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: other.name,
      email: other.email,
      password: other.password,
      confirmPassword: other.confirmPassword,
    },
  })

  async function onSubmit(formData: z.infer<typeof registrationSchema>) {
    await signIn("credentials", formData).then((res) => {

    })
  }

  function handlerChangeValue(e: ChangeEvent<HTMLInputElement>, fieldName: keyof z.infer<typeof registrationSchema>) {
    const value = e.target.value;
    changeValues({ [fieldName]: value });
    form.setValue(fieldName, value);
  }

  function handlerReset() {
    form.reset();
    changeValues({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }

  return (
    <div
      className="grow flex justify-center items-center"
    >
      <Card
        className="w-full max-w-[500px]"
      >
        <CardHeader>
          <CardTitle
            className="text-2xl text-center pb-2"
          >
            Registration
          </CardTitle>
          <CardDescription
            className="text-center"
          >
            Registration details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-2"
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
                        placeholder="Your name"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handlerChangeValue(e, "name");
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
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
                        type="email"
                        placeholder="example@mail.com"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handlerChangeValue(e, "email");
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your email address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="******"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handlerChangeValue(e, "password");
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="******"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handlerChangeValue(e, "confirmPassword");
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Confirm password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div
                className="flex justify-around"
              >
                <Button
                  type="reset"
                  variant="secondary"
                  onClick={handlerReset}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter
          className="text-center text-gray-500 flex justify-center"
        >
          If you have an account, click &nbsp;<Link className="text-cyan-500" href={Routers.login}> here</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
