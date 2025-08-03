import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import BreadcrumbsSkeleton from "@/components/breadscums-skeleton";

const loading = () => {
  return (
    <main className="container mx-auto py-4">
      <BreadcrumbsSkeleton />
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-6 w-24" />
          <div className="flex items-center mb-4 gap-2">
            <Skeleton className="h-6 w-12" />
            <Badge variant={"outline"}>
              <Skeleton className="h-6 w-24" />
            </Badge>
          </div>

          <Separator className="my-4" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-full" />
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default loading;
