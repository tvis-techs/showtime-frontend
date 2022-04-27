import { Suspense, useState } from "react";
import { useWindowDimensions } from "react-native";

import { useTrendingCreators, useTrendingNFTS } from "app/hooks/api-hooks";
import { useRouter } from "app/navigation/use-router";
import { CARD_DARK_SHADOW } from "app/utilities";

import {
  CreatorPreview,
  SegmentedControl,
  Spinner,
  Tabs,
  Text,
  View,
} from "design-system";
import { Card } from "design-system/card";
import { useIsDarkMode } from "design-system/hooks";
import { breakpoints } from "design-system/theme";

export const Trending = () => {
  const [selected, setSelected] = useState(0);

  return (
    <View tw="bg-gray-100 dark:bg-black">
      <View tw="w-[90%] mx-auto py-8">
        <View tw="flex-row justify-between items-center">
          <View>
            <Text variant="text-2xl" tw="text-black dark:text-white">
              Trending
            </Text>
          </View>
          <View tw="w-[400px] bg-white dark:bg-black p-4 shadow-lg rounded-lg">
            <SegmentedControl
              values={["CREATOR", "NFT"]}
              onChange={setSelected}
              selectedIndex={selected}
            />
          </View>
        </View>
        <TrendingTabs selectedTab={selected === 0 ? "creator" : "nft"} />
      </View>
    </View>
  );
};

const TrendingTabs = ({ selectedTab }: { selectedTab: "nft" | "creator" }) => {
  const [selected, setSelected] = useState(0);
  const days = selected === 0 ? 1 : selected === 1 ? 7 : 30;
  return (
    <Tabs.Root onIndexChange={setSelected} initialIndex={selected} lazy>
      <Tabs.List
        scrollEnabled={false}
        style={{ backgroundColor: "transparent" }}
        contentContainerStyle={{ backgroundColor: "transparent" }}
      >
        <Tabs.Trigger>
          <Text tw="p-4 text-black dark:text-white">Today</Text>
        </Tabs.Trigger>

        <Tabs.Trigger>
          <Text tw="p-4 text-black dark:text-white">This week</Text>
        </Tabs.Trigger>

        <Tabs.Trigger>
          <Text tw="p-4 text-black dark:text-white">This month</Text>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Pager>
        <View tw="flex-1" nativeID="12132323">
          <Suspense fallback={null}>
            <List days={days} selectedTab={selectedTab} />
          </Suspense>
        </View>
        <View tw="flex-1">
          <Suspense fallback={null}>
            <List days={days} selectedTab={selectedTab} />
          </Suspense>
        </View>
        <View tw="flex-1">
          <Suspense fallback={null}>
            <List days={days} selectedTab={selectedTab} />
          </Suspense>
        </View>
      </Tabs.Pager>
    </Tabs.Root>
  );
};

const List = ({
  days,
  selectedTab,
}: {
  days: number;
  selectedTab: "creator" | "nft";
}) => {
  if (selectedTab === "creator") {
    return <CreatorsList days={days} />;
  }

  return <NFTList days={days} />;
};

const CreatorsList = ({ days }: { days: any }) => {
  const { data, isLoading } = useTrendingCreators({
    days,
  });

  const router = useRouter();

  const [containerWidth, setContainerWidth] = useState(0);
  const isDark = useIsDarkMode();

  return (
    <View
      tw="flex-1 mt-4"
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {isLoading ? (
        <View tw="mx-auto p-10">
          <Spinner />
        </View>
      ) : null}
      {data.length > 0 && containerWidth
        ? data.map((item) => {
            return (
              <View
                key={item.creator_id}
                tw="bg-white dark:bg-black rounded-lg mb-8"
                //@ts-ignore
                style={{ boxShadow: isDark ? CARD_DARK_SHADOW : null }}
              >
                <CreatorPreview
                  creator={item}
                  onMediaPress={(initialScrollIndex: number) => {
                    router.push(
                      `/list?initialScrollIndex=${initialScrollIndex}&type=trendingCreator&days=${days}&creatorId=${item.profile_id}`
                    );
                  }}
                  mediaSize={containerWidth / 3 - 2}
                />
              </View>
            );
          })
        : null}
    </View>
  );
};

const NFTList = ({ days }: { days: any }) => {
  const router = useRouter();
  const { data, isLoading } = useTrendingNFTS({
    days,
  });

  const [containerWidth, setContainerWidth] = useState(0);

  const { width } = useWindowDimensions();

  const numColumns = width >= breakpoints["lg"] ? 3 : 2;

  return (
    <View
      tw="flex-1 flex-row flex-wrap justify-between mt-4"
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {isLoading ? (
        <View tw="mx-auto p-10">
          <Spinner />
        </View>
      ) : null}
      {data.length > 0 && containerWidth
        ? data.map((item, index) => {
            return (
              <Card
                nft={item}
                tw={`w-[${containerWidth / numColumns - 30}px] h-[${
                  containerWidth / numColumns + 205
                }px] mb-8`}
                onPress={() =>
                  router.push(
                    `/list?initialScrollIndex=${index}&days=${days}&type=trendingNFTs`
                  )
                }
              />
            );
          })
        : null}
    </View>
  );
};