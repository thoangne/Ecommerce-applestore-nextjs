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
import { RegisterSchema, RegisterSchemaType } from "@/lib/schemas";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/action/auth";
import Image from "next/image";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const { update: updateSession } = useSession();
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (data: RegisterSchemaType) => {
    setError(null);
    try {
      const result = await registerUser(data);
      if (result?.error) {
        setError(result?.error || "An error occurred while registering user.");
      } else {
        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        if (signInResult?.error) {
          setError("An error occurred while signing in after registration.");
        } else {
          await updateSession?.();
          router.push("/");
        }
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while registering user.");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E5E5E5] to-[#DADADA] dark:from-[#0B0B0B] dark:via-[#1A1A1A] dark:to-[#2A2A2A] transition-colors duration-500">
      {/* Nền mờ nhẹ */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `url("/picture/background-signin.png")`,
          filter: "brightness(0.7) blur(8px)",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/10 to-black/30 dark:from-black/40 dark:to-black/80" />

      {/* Modal Sign Up */}
      <Card className="w-full max-w-6xl h-[700px] shadow-2xl border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md overflow-hidden rounded-3xl transform scale-[1.05] transition-all duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Cột trái: Form đăng ký */}
          <div className="p-10 lg:p-16 flex flex-col justify-center">
            <CardHeader className="text-center p-0 mb-8">
              <CardTitle className="text-3xl font-bold text-neutral-900 dark:text-white">
                Create an account
              </CardTitle>
              <CardDescription className="text-neutral-600 dark:text-neutral-400 text-base mt-2">
                Or{" "}
                <Link
                  className="font-medium hover:underline text-neutral-800 dark:text-neutral-200"
                  href={"/auth/signin"}
                >
                  sign in to your account
                </Link>
              </CardDescription>
            </CardHeader>

            {error && (
              <p className="mb-4 text-sm text-red-500 text-center">{error}</p>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 max-w-sm mx-auto w-full"
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          className="py-3 text-base bg-transparent border border-neutral-300 dark:border-neutral-600 focus:border-neutral-900 dark:focus:border-white text-neutral-900 dark:text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your password"
                          className="py-3 text-base bg-transparent border border-neutral-300 dark:border-neutral-600 focus:border-neutral-900 dark:focus:border-white text-neutral-900 dark:text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full text-base py-3 font-semibold bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-all"
                  disabled={form.formState.isSubmitting}
                >
                  Let’s go
                </Button>
              </form>
            </Form>
          </div>

          {/* Cột phải: Ảnh quảng cáo */}
          <div className="relative hidden md:flex items-center justify-center p-4 pr-6">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/picture/ip.png"
                alt="iPhone 17 Series Promo"
                fill
                className="object-cover rounded-2xl"
                style={{ objectPosition: "center right" }}
              />
              <div className="absolute inset-0 rounded-2xl backdrop-blur-[3px] bg-gradient-to-t from-white/70 via-white/20 to-transparent dark:from-black/70 dark:via-black/40 dark:to-transparent transition-all duration-500" />
              <div className="absolute bottom-8 left-8 right-8 text-neutral-900 dark:text-white">
                <h2 className="text-4xl font-semibold mb-3">
                  iPhone 17 Series
                </h2>
                <p className="text-neutral-700 dark:text-neutral-200 mb-5 text-sm leading-relaxed">
                  Đăng ký ngay để nhận ưu đãi đặt trước iPhone 17 – Thiết kế
                  titan siêu nhẹ, camera UltraFusion và chip A19 Fusion mới
                  nhất.
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
