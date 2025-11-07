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
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginSchemaType } from "@/lib/schemas";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Chrome, Facebook, Github } from "lucide-react";
import { toast } from "sonner";

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const { update: updateSession } = useSession();
  const route = useRouter();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setError(null);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("An error occurred while signing in.");
        setError(
          result.error === "CredentialsSignin"
            ? "Invalid email or password."
            : "An error occurred while signing in."
        );
      } else {
        toast.success(`Successfully signed in as ${data.email}!`);
        await updateSession?.();
        route.push("/");
      }
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred while signing in.");
    }
  };

  // ✅ Login bằng OAuth
  const handleOAuthSignIn = async (provider: string) => {
    await signIn(provider, { callbackUrl: "/" });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E5E5E5] to-[#DADADA] dark:from-[#0B0B0B] dark:via-[#1A1A1A] dark:to-[#2A2A2A] transition-colors duration-500">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `url("/picture/background-signin.png")`,
          filter: "brightness(0.7) blur(8px)",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/10 to-black/30 dark:from-black/40 dark:to-black/80" />

      {/* Card */}
      <Card className="w-full max-w-6xl h-[700px] shadow-2xl border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md overflow-hidden transform scale-[1.05] md:scale-[1.08] transition-all duration-500 rounded-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Form đăng nhập */}
          <div className="p-10 lg:p-16 flex flex-col justify-center">
            <CardHeader className="text-center p-0 mb-8">
              <CardTitle className="text-3xl font-bold text-neutral-900 dark:text-white">
                Sign in to your account
              </CardTitle>
              <CardDescription className="text-neutral-600 dark:text-neutral-400 text-base mt-2">
                Or{" "}
                <Link
                  className="font-medium hover:underline text-neutral-800 dark:text-neutral-200"
                  href={"/auth/signup"}
                >
                  create an account
                </Link>
              </CardDescription>
            </CardHeader>

            {error && (
              <p className="mb-4 text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Traditional login */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 max-w-sm mx-auto w-full"
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          className="py-3 text-base bg-transparent border border-neutral-300 dark:border-neutral-600 focus:border-neutral-900 dark:focus:border-white text-neutral-900 dark:text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className="py-3 text-base bg-transparent border border-neutral-300 dark:border-neutral-600 focus:border-neutral-900 dark:focus:border-white text-neutral-900 dark:text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Forgot password */}
                <div className="flex justify-end">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm font-medium transition text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full mt-4 text-base py-3 font-semibold bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-white transition-all"
                >
                  Sign in
                </Button>
              </form>
            </Form>

            {/* Divider */}
            <div className="relative flex items-center justify-center mt-8 mb-4">
              <div className="h-[1px] w-full bg-neutral-300 dark:bg-neutral-700"></div>
              <span className="absolute  dark:bg-neutral-900 px-3 text-sm text-neutral-500 dark:text-neutral-400">
                or continue with
              </span>
            </div>

            {/* Social buttons */}
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => handleOAuthSignIn("google")}
                className="flex items-center gap-2 w-32 border-neutral-400 dark:border-neutral-600 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <Chrome />
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOAuthSignIn("facebook")}
                className="flex items-center gap-2 w-32 border-neutral-400 dark:border-neutral-600 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <Facebook />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOAuthSignIn("github")}
                className="flex items-center gap-2 w-32 border-neutral-400 dark:border-neutral-600 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <Github />
                GitHub
              </Button>
            </div>
          </div>

          {/* Ảnh bên phải */}
          <div className="relative hidden md:flex items-center justify-center p-4 pr-6">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/picture/ip.png"
                alt="iPhone 17 Promo"
                fill
                className="object-cover rounded-2xl"
                style={{ objectPosition: "center right" }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 rounded-2xl backdrop-blur-[2px] bg-gradient-to-t from-white/70 via-white/20 to-transparent dark:from-black/70 dark:via-black/40 dark:to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-neutral-900 dark:text-white transition-colors">
                <h2 className="text-4xl font-semibold mb-3">
                  iPhone 17 Series
                </h2>
                <p className="text-neutral-700 dark:text-neutral-200 mb-5 text-sm leading-relaxed">
                  Đón đầu thế hệ công nghệ mới – Thiết kế titan siêu nhẹ, camera
                  UltraFusion và chip A19 Fusion mạnh mẽ vượt trội.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-all text-base font-semibold"
                >
                  <Link href="/products/iphone-17-pro">Đặt hàng ngay</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}
