"use client";

import { memo } from "react";
import { formatUnits } from "viem";
import { Copy, Check, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/useBatchProfiles";
import { viewProfile } from "@/hooks/useFarcaster";
import { TOKEN_DECIMALS } from "@/lib/constants";

type MinerSectionProps = {
  minerAddress: string;
  isCurrentUserMiner: boolean;
  glazedAmount: bigint;
  glazedUsd: number;
  rateUsd: number;
  glazeElapsedSeconds: number;
  nextUps: bigint;
  tokenSymbol: string;
  tokenLogoUrl: string | null;
  rigAddress: string;
  onShareMine: () => void;
  copiedLink: boolean;
  onCopyLink: () => void;
};

const formatTime = (seconds: number): string => {
  if (seconds < 0) return "0s";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
};

const formatUsd = (value: number, compact = false) => {
  if (compact) {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
  }
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const MinerSection = memo(function MinerSection({
  minerAddress,
  isCurrentUserMiner,
  glazedAmount,
  glazedUsd,
  rateUsd,
  glazeElapsedSeconds,
  nextUps,
  tokenSymbol,
  tokenLogoUrl,
  onShareMine,
  copiedLink,
  onCopyLink,
}: MinerSectionProps) {
  const { displayName, avatarUrl, fid } = useProfile(minerAddress);

  const handleProfileClick = () => {
    if (fid) viewProfile(fid);
  };

  return (
    <div className="px-2 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold">Miner</h2>
        <div className="flex items-center gap-2">
          {isCurrentUserMiner && (
            <button
              onClick={onShareMine}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors text-xs text-purple-400"
              title="Cast to Farcaster"
            >
              <Share2 className="w-3.5 h-3.5" />
              Cast
            </button>
          )}
          <button
            onClick={onCopyLink}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-xs text-zinc-400"
            title="Copy link"
          >
            {copiedLink ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copiedLink ? "Copied" : "Share"}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleProfileClick}
          disabled={!fid}
          className={fid ? "cursor-pointer" : "cursor-default"}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-zinc-800 text-white text-xs">
              {minerAddress.slice(-2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
        <button
          onClick={handleProfileClick}
          disabled={!fid}
          className={`flex-1 text-left ${fid ? "cursor-pointer" : "cursor-default"}`}
        >
          <div
            className={`text-sm font-semibold text-white ${fid ? "hover:text-purple-400" : ""}`}
          >
            {displayName}
          </div>
          <div className="text-xs text-zinc-500">
            {minerAddress.slice(0, 6)}...{minerAddress.slice(-4)}
          </div>
        </button>
        <div className="text-right">
          <div className="text-xs text-zinc-500">
            {formatTime(glazeElapsedSeconds)}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-3">
        <div>
          <div className="text-xs text-zinc-500">Mine rate</div>
          <div className="text-sm font-semibold">
            {Number(formatUnits(nextUps, TOKEN_DECIMALS)).toFixed(2)}/s
          </div>
          <div className="text-[10px] text-zinc-600">${rateUsd.toFixed(4)}/s</div>
        </div>
        <div>
          <div className="text-xs text-zinc-500">Mined</div>
          <div className="flex items-center gap-1 text-sm font-semibold">
            <span>+</span>
            {tokenLogoUrl ? (
              <img
                src={tokenLogoUrl}
                alt={tokenSymbol}
                className="w-4 h-4 rounded-full"
              />
            ) : (
              <span className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-[8px] text-black font-bold">
                {tokenSymbol.slice(0, 2)}
              </span>
            )}
            <span>
              {Number(formatUnits(glazedAmount, TOKEN_DECIMALS)).toLocaleString(
                undefined,
                { maximumFractionDigits: 0 }
              )}
            </span>
          </div>
          <div className="text-[10px] text-zinc-600">{formatUsd(glazedUsd)}</div>
        </div>
        <div>
          <div className="text-xs text-zinc-500">Total</div>
          <div className="text-sm font-semibold">
            +{formatUsd(glazedUsd + glazedUsd)}
          </div>
        </div>
        <div>
          <div className="text-xs text-zinc-500">PnL</div>
          <div className="text-sm font-semibold">
            +Ξ{(glazedUsd / 3500).toFixed(4)}
          </div>
          <div className="text-[10px] text-zinc-600">{formatUsd(glazedUsd)}</div>
        </div>
      </div>
    </div>
  );
});
