"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { loginSchema } from "@/lib/schemas/login-schema";
import { Routers } from "@/types/routers";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter(); // Initialize the router
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "karma@gmail.com",
      password: "Uva123456",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          ...values,
          redirect: false, // Disable automatic redirection
          callbackUrl: Routers.Home, // Redirect to home page after login
        });

        if (result?.error) {
          form.setError("email", {
            type: "manual",
            message: "Invalid email",
          });
          form.setError("password", {
            type: "manual",
            message: "Invalid password",
          });
          toast.error("Invalid e-mail address or password")
        } else {
          router.push(result?.url || Routers.Home); // Redirect programmatically
        }
      } catch (err) {
        console.error("Login error:", err);
      }
    });
  }

  function handlerReset() {
    form.reset();
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
            Login
          </CardTitle>
          <CardDescription
            className="text-center"
          >
            login details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-2"
            >
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
                        disabled={isPending} // Pass disabled prop here
                        {...field}
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
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="******"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your password.
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
                  disabled={isPending}
                  onClick={handlerReset}
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
        </CardContent>
        <CardFooter
          className="text-center text-gray-500 flex justify-center"
        >
          If you don't have an account, click &nbsp;<Link className="text-cyan-500" href={Routers.Registration}> here</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
