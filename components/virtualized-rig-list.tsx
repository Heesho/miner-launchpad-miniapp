"use client";

import { memo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { RigCard } from "@/components/rig-card";
import { RigListSkeleton } from "@/components/skeleton";
import type { RigListItem } from "@/hooks/useAllRigs";

type VirtualizedRigListProps = {
  rigs: RigListItem[];
  donutUsdPrice: number;
  isLoading: boolean;
  topBumpAddress?: string | null;
  newBumpAddress?: string | null;
};

const ITEM_HEIGHT = 76; // Height of each RigCard in pixels

/**
 * Virtualized list for rendering many rig cards efficiently
 * Only renders items that are visible in the viewport
 */
export const VirtualizedRigList = memo(function VirtualizedRigList({
  rigs,
  donutUsdPrice,
  isLoading,
  topBumpAddress,
  newBumpAddress,
}: VirtualizedRigListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rigs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5, // Render 5 extra items above and below viewport
  });

  if (isLoading) {
    return <RigListSkeleton count={8} />;
  }

  if (rigs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-gray-500">
        <p className="text-sm">No rigs found</p>
      </div>
    );
  }

  // For small lists (<20 items), don't virtualize - the overhead isn't worth it
  if (rigs.length < 20) {
    return (
      <div className="space-y-1.5">
        {rigs.map((rig, index) => (
          <RigCard
            key={rig.address}
            rig={rig}
            donutUsdPrice={donutUsdPrice}
            isTopBump={index === 0 && rig.address === topBumpAddress}
            isNewBump={rig.address === newBumpAddress}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="h-full overflow-auto scrollbar-hide"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const rig = rigs[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <RigCard
                rig={rig}
                donutUsdPrice={donutUsdPrice}
                isTopBump={virtualItem.index === 0 && rig.address === topBumpAddress}
                isNewBump={rig.address === newBumpAddress}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});
