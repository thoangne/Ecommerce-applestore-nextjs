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
import { LoginSchema, LoginSchemaType } from "@/lib/schemas";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const { data: session, update: updateSession } = useSession();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema), // ✅ connect Zod
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const route = useRouter();

  const onSubmit = async (data: LoginSchemaType) => {
    setError(null);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          setError("Invalid email or password.");
        } else {
          setError("An error occurred while signing in with credentials.");
        }
      } else {
        // Refresh session to get updated user data
        await updateSession();
        route.push("/");
      }
    } catch (error) {
      console.error(error, "Sign in error");
      setError("An error occurred while signing in with credentials.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to your account</CardTitle>
          <CardDescription>
            Or{" "}
            <Link
              className="font-medium text-primary hover:underline"
              href={"/auth/signup"}
            >
              create an account
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-4 text-sm text-destructive ">{error}</p>}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              {/* {session?.user && <pre>{JSON.stringify(session, null, 2)}</pre>} */}
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
