import { useState, useContext, useEffect } from "react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "design-system/dropdown-menu";
import { Button } from "design-system";
import { MoreHorizontal } from "design-system/icon";
import { tw } from "design-system/tailwind";
import type { NFT } from "app/types";
import { useReport } from "app/hooks/use-report";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useRouter } from "app/navigation/use-router";

type Props = {
  nft: NFT;
};

function NFTDropdown({ nft }: Props) {
  const { userAddress } = useCurrentUserAddress();
  const [isOwner, setIsOwner] = useState(false);

  const { report } = useReport();
  const router = useRouter();

  useEffect(() => {
    setIsOwner(nft?.owner_address === userAddress);
  }, [userAddress]);

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <Button variant="tertiary" iconOnly={true} size="regular">
          <MoreHorizontal
            color={
              tw.style("bg-black dark:bg-white")?.backgroundColor as string
            }
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        loop
        tw="w-60 p-2 bg-white dark:bg-gray-900 rounded-2xl shadow"
      >
        <DropdownMenuItem
          onSelect={() => {}}
          key="copy-link"
          tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
        >
          <DropdownMenuItemTitle tw="text-black dark:text-white">
            Copy Link
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuSeparator tw="h-[1px] m-1 bg-gray-200 dark:bg-gray-700" />

        {/* <DropdownMenuItem
          onSelect={() => {}}
          key="refresh-metadata"
          tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
        >
          <DropdownMenuItemTitle tw="text-black dark:text-white">
            Refresh Metadata
          </DropdownMenuItemTitle>
        </DropdownMenuItem> */}

        {!isOwner && (
          <DropdownMenuItem
            onSelect={async () => {
              await report({ nftId: nft.token_id });
              router.pop();
            }}
            key="report"
            tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
          >
            <DropdownMenuItemTitle tw="text-black dark:text-white">
              Report
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        {isOwner && (
          <DropdownMenuItem
            onSelect={() => router.push(`/nft/${nft.nft_id}/transfer`)}
            key="transfer"
            tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
          >
            <DropdownMenuItemTitle tw="text-black dark:text-white">
              Transfer
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        {isOwner && (
          <DropdownMenuItem
            destructive
            onSelect={() => {}}
            key="delete"
            tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
          >
            <DropdownMenuItemTitle tw="text-black dark:text-white">
              Delete
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

export { NFTDropdown };
