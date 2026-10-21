import { Stack } from "expo-router";
import { StudySessionProvider } from "../context/StudySessionContext";
import { SettingsProvider } from "../context/SettingsContext";

export default function RootLayout() {
  return (
    <StudySessionProvider>
      <SettingsProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SettingsProvider>
    </StudySessionProvider>
  );
}

