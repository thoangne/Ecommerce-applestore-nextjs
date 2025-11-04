"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const menu = [
  { label: "Profile", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Settings", href: "/account/settings" },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className="container mx-auto py-8 flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <aside className="md:w-64 w-full md:border-r">
        <Card className="shadow-none border-none">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">My Account</h2>
            <nav className="flex md:flex-col flex-row md:space-y-2 space-x-4 md:space-x-0">
              {menu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors",
                    pathname === item.href
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Separator className="my-4 md:block hidden" />
          </CardContent>
        </Card>
      </aside>

      {/* Content */}
      <section className="flex-1">{children}</section>
    </main>
  );
}
