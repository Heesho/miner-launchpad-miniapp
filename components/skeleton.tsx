"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

export const Skeleton = memo(function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-zinc-800/50",
        className
      )}
    />
  );
});

/**
 * Skeleton for a rig card in the list
 */
export const RigCardSkeleton = memo(function RigCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 mb-1.5">
      {/* Logo skeleton */}
      <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />

      {/* Text skeleton */}
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>

      {/* Price skeleton */}
      <div className="flex-shrink-0 space-y-2 text-right">
        <Skeleton className="h-4 w-16 ml-auto" />
        <Skeleton className="h-3 w-12 ml-auto" />
      </div>
    </div>
  );
});

/**
 * Skeleton for multiple rig cards
 */
export const RigListSkeleton = memo(function RigListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <RigCardSkeleton key={i} />
      ))}
    </div>
  );
});

/**
 * Skeleton for the price chart
 */
export const ChartSkeleton = memo(function ChartSkeleton({ height = 160 }: { height?: number }) {
  return (
    <div
      className="w-full flex items-center justify-center bg-zinc-900/30 rounded-lg"
      style={{ height }}
    >
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="w-32 h-2" />
        <Skeleton className="w-24 h-2" />
        <Skeleton className="w-28 h-2" />
      </div>
    </div>
  );
});

/**
 * Skeleton for profile/avatar
 */
export const AvatarSkeleton = memo(function AvatarSkeleton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  return <Skeleton className={cn("rounded-full", sizeClasses[size])} />;
});

/**
 * Skeleton for the leaderboard
 */
export const LeaderboardSkeleton = memo(function LeaderboardSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-2 w-16" />
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
});

/**
 * Skeleton for mine history
 */
export const MineHistorySkeleton = memo(function MineHistorySkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/50">
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-1 text-right">
            <Skeleton className="h-3 w-16 ml-auto" />
            <Skeleton className="h-2 w-12 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
});
