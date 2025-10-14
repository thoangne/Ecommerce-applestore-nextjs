"use client";

import { useSession } from "next-auth/react";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import Link from "next/link";
import { LogIn, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react"; // nếu bạn dùng next-auth mặc định
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Skeleton className="w-9 h-9"></Skeleton>;
  }

  if (status === "unauthenticated") {
    return (
      <Button variant={"ghost"} className="hover:cursor-pointer" size={"icon"}>
        <Link href="/auth/signin">
          <LogIn className="w-4 h-4" />
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className="hover:cursor-pointer"
          size={"icon"}
        >
          <User className="w-4 h-4" />
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
          onClick={() => signOut()}
          className="hover:cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
