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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      <div className="container mx-auto py-8 flex flex-col md:flex-row gap-6 px-4">
        {/* Sidebar */}
        <aside className="md:w-64 w-full">
          <Card className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border border-gray-200 dark:border-slate-700/50 shadow-xl">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white">
                My Account
              </h2>
              <nav className="flex md:flex-col flex-row md:space-y-2 space-x-4 md:space-x-0 overflow-x-auto">
                {menu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap",
                      pathname === item.href
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                        : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/50"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <Separator className="my-4 md:my-6 md:block hidden bg-gray-200 dark:bg-slate-700/50" />
            </CardContent>
          </Card>
        </aside>

        {/* Content */}
        <section className="flex-1">{children}</section>
      </div>
    </main>
  );
}
