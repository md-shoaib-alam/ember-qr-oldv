import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';

import { EmberBackground } from '@/components/EmberBackground';
import { Icon, type IconName } from '@/components/Icon';
import { LiquidTabBar } from '@/components/LiquidTabBar';
import { useTheme } from '@/theme';

// Keep the splash screen up until the fonts are ready, so the first frame is already in Bricolage.
SplashScreen.preventAutoHideAsync();

const TABS: { name: string; title: string; icon: IconName }[] = [
  { name: 'index', title: 'Text', icon: 'edit_note' },
  { name: 'url', title: 'Link', icon: 'link' },
  { name: 'wifi', title: 'Wi-Fi', icon: 'contactless' },
  { name: 'phone', title: 'Phone', icon: 'call' },
];

export default function RootLayout() {
  const c = useTheme();
  const [loaded, error] = useFonts({
    'Bricolage-800-40': require('@/assets/fonts/Bricolage-800-40.ttf'),
    'Bricolage-700-16': require('@/assets/fonts/Bricolage-700-16.ttf'),
    'Bricolage-600-16': require('@/assets/fonts/Bricolage-600-16.ttf'),
    MaterialSymbolsOutline: require('@/assets/fonts/MaterialSymbolsOutline.ttf'),
    MaterialSymbolsFill: require('@/assets/fonts/MaterialSymbolsFill.ttf'),
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hide();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <StatusBar style="auto" />
      <EmberBackground />
      <Tabs
        tabBar={(props) => <LiquidTabBar {...props} />}
        screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: 'transparent' } }}>
        {TABS.map((t) => (
          <Tabs.Screen
            key={t.name}
            name={t.name}
            options={{
              title: t.title,
              tabBarIcon: ({ color, size, focused }) => (
                <Icon name={t.icon} size={size} color={color} filled={focused} />
              ),
            }}
          />
        ))}
      </Tabs>
    </View>
  );
}
