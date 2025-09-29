import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeAreaWrapper>
        <Slot />
      </SafeAreaWrapper>
    </ClerkProvider>
  );
}
