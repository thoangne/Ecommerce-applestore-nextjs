"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // ✅ import resolver
import { RegisterSchema, RegisterSchemaType } from "@/lib/schemas";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/action/auth";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const { data: session, update: updateSession } = useSession();
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema), // ✅ connect Zod
    defaultValues: {
      name: "",
      confirmPassword: "",
      email: "",
      password: "",
    },
  });

  const route = useRouter();

  const onSubmit = async (data: RegisterSchemaType) => {
    setError(null);
    form.clearErrors();
    try {
      const result = await registerUser(data);
      if (result?.error) {
        setError(result?.error || "An error occurred while registering user.");
      } else {
        // After successful registration, sign in the user
        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        if (signInResult?.error) {
          setError("An error occurred while signing in after registration.");
        } else {
          // Refresh session to get updated user data
          await updateSession();

          route.push("/");
        }
      }
    } catch (error) {
      console.error(error, "Registration error");
      setError("An error occurred while registering user.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Or{" "}
            <Link
              className="font-medium text-primary hover:underline"
              href={"/auth/signin"}
            >
              sign in to your account
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-4 text-sm text-destructive ">{error}</p>}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage /> {/* ✅ shows zod error */}
                  </FormItem>
                )}
              />

              {/* Email field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage /> {/* ✅ shows zod error */}
                  </FormItem>
                )}
              />
              {/* [TODO]: hidden button to show password */}
              {/* Password field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage /> {/* ✅ shows zod error */}
                  </FormItem>
                )}
              />
              {/* [TODO]: hidden button to show password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage /> {/* ✅ shows zod error */}
                  </FormItem>
                )}
              />

              {/* {session?.user && <pre>{JSON.stringify(session, null, 2)}</pre>} */}
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                Let&apos;s gooooooo
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
