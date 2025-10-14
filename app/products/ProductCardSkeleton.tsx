import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductCardSkeleton = () => {
  return (
    <Card className="border rounded-lg shadow-md border-gray-200 ">
      <CardContent>
        <div className=" relative aspect-video rounded-lg overflow-hidden">
          <Skeleton className="h-full w-full" />
        </div>
      </CardContent>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-24" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-48" />
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between items-center">
        <span className="text-lg font-semibold">
          <Skeleton className="h-6 w-12" />
        </span>
      </CardFooter>
    </Card>
  );
};
