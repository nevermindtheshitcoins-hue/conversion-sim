'use client';
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 p-2">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-7 w-48" />
      </div>
      
      <Skeleton className="h-5 w-3/4" />
      
      <div className="space-y-4 pt-4">
        <Skeleton className="h-8 w-full" />
        <div className="pl-4 space-y-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-2/5" />
        </div>
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
