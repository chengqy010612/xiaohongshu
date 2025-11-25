import { useFonts } from 'expo-font';
import { useEffect } from 'react';

export function useCustomFonts() {
  const [fontsLoaded] = useFonts({
    // 这里可以添加自定义字体
    // 例如: 'CustomFont': require('./assets/fonts/CustomFont.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      console.log('Fonts loaded successfully');
    }
  }, [fontsLoaded]);

  return fontsLoaded;
}