"use client";

import { useSession } from "next-auth/react";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import Link from "next/link";
import { LogIn, LogOut, User, User2 } from "lucide-react";
import { signOut } from "next-auth/react"; // nếu bạn dùng next-auth mặc định
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
import Image from "next/image";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Skeleton className="w-9 h-9"></Skeleton>;
  }

  if (status === "unauthenticated") {
    return (
      <Button variant={"ghost"} className="hover:cursor-pointer" size={"icon"}>
        <Link href="/auth/signin">
          <User2 className="w-4 h-4" />
        </Link>
      </Button>
    );
  }
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    toast.success("Successfully signed out!");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className="hover:cursor-pointer"
          size={"icon"}
        >
          <Image
            src={session?.user?.avatarUrl || "/picture/background-dark.png"}
            alt="logo"
            width={25}
            height={25}
            className="rounded-xl"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Hello, {session?.user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/account"} className="hover:cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            Your account
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleSignOut}
          className="hover:cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
//auth-status.tsx
