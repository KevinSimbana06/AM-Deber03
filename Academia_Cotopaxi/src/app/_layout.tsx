import { Stack } from "expo-router";
import { StudySessionProvider } from "../context/StudySessionContext";

export default function RootLayout() {
  return (
    <StudySessionProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </StudySessionProvider>
  );
}
