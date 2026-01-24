"use client";

import { memo, useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatEther } from "viem";
import type { RigListItem } from "@/hooks/useAllRigs";
import { cn } from "@/lib/utils";
import { useTokenMetadata } from "@/hooks/useMetadata";

const formatEth = (value: bigint, maximumFractionDigits = 4) => {
  if (value === 0n) return "0";
  const asNumber = Number(formatEther(value));
  if (!Number.isFinite(asNumber)) {
    return formatEther(value);
  }
  return asNumber.toLocaleString(undefined, {
    maximumFractionDigits,
  });
};

type RigCardProps = {
  rig: RigListItem;
  donutUsdPrice?: number;
  isTopBump?: boolean;
  isNewBump?: boolean;
};

const formatUsd = (value: number) => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

export const RigCard = memo(function RigCard({ rig, donutUsdPrice = 0.01, isTopBump = false, isNewBump = false }: RigCardProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  // Calculate market cap: totalMinted * unitPrice (in DONUT) * donutUsdPrice
  const marketCapUsd = rig.unitPrice > 0n
    ? Number(formatEther(rig.totalMinted)) * Number(formatEther(rig.unitPrice)) * donutUsdPrice
    : 0;

  // Use cached metadata hook instead of fetching on every render
  const { logoUrl, isLoading: isLoadingMetadata } = useTokenMetadata(rig.rigUri);

  // Reset error state when logoUrl changes
  const handleImageError = useCallback(() => {
    setImgError(true);
  }, []);

  // Prefetch the rig page on hover for faster navigation
  const handleMouseEnter = useCallback(() => {
    router.prefetch(`/rig/${rig.address}`);
  }, [router, rig.address]);

  const showLogo = logoUrl && !imgError;

  return (
    <Link
      href={`/rig/${rig.address}`}
      className="block mb-1.5"
      onMouseEnter={handleMouseEnter}
      prefetch={false} // Disable automatic prefetch, we do it on hover
    >
      <div
        className={cn(
          "flex items-center gap-3 p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer",
          isNewBump && "animate-bump-enter",
          isTopBump && !isNewBump && "animate-bump-glow"
        )}
      >
        {/* Token Logo - Using native lazy loading */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center overflow-hidden">
          {showLogo ? (
            <img
              src={logoUrl}
              alt={rig.tokenSymbol}
              width={48}
              height={48}
              className="w-12 h-12 object-cover rounded-xl"
              loading="lazy"
              decoding="async"
              onError={handleImageError}
            />
          ) : isLoadingMetadata ? (
            <div className="w-12 h-12 animate-pulse bg-zinc-700 rounded-xl" />
          ) : (
            <span className="text-purple-500 font-bold text-lg">
              {rig.tokenSymbol.slice(0, 2)}
            </span>
          )}
        </div>

        {/* Token Name & Symbol */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white truncate">
            {rig.tokenName}
          </div>
          <div className="text-sm text-gray-500">
            {rig.tokenSymbol}
          </div>
        </div>

        {/* Price & Market Cap */}
        <div className="flex-shrink-0 text-right">
          <div className="text-sm font-semibold text-purple-500">
            Ξ{formatEth(rig.price, 5)}
          </div>
          <div className="text-xs text-gray-500">
            {formatUsd(marketCapUsd)} mcap
          </div>
        </div>
      </div>
    </Link>
  );
});

