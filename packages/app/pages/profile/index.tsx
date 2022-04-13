import { HeaderRight } from "app/components/header";
import { useUser } from "app/hooks/use-user";
import { useSafeAreaInsets } from "app/lib/safe-area";
import { createStackNavigator } from "app/navigation/create-stack-navigator";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { ProfileStackParams } from "app/navigation/types";
import { ProfileScreen } from "app/screens/profile";

import { useIsDarkMode } from "design-system/hooks";

const ProfileStack = createStackNavigator<ProfileStackParams>();

function ProfileNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();
  const { user } = useUser();

  return (
    <ProfileStack.Navigator
      // @ts-ignore
      screenOptions={screenOptions({
        safeAreaTop,
        isDark,
        headerLeft: () => null,
        headerRight: HeaderRight,
      })}
    >
      <ProfileStack.Screen
        name="profile"
        component={ProfileScreen}
        initialParams={{
          username:
            user?.data?.profile?.username ??
            user?.data?.profile?.wallet_addresses_v2?.[0]?.address,
        }}
        getId={({ params }) => params?.username}
      />
    </ProfileStack.Navigator>
  );
}

export default ProfileNavigator;