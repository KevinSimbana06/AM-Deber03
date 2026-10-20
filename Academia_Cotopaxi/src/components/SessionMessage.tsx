import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

export interface SessionMessageProps {
  error?: string | null;
  warning?: string | null;
  info?: string | null;
  onOpenSettings?: () => void;
}

export function SessionMessage({
  error,
  warning,
  info,
  onOpenSettings,
}: SessionMessageProps) {
  if (!error && !warning && !info) {
    return null;
  }

  return (
    <View accessibilityLiveRegion="polite" style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {warning ? (
        <View style={styles.warningContainer}>
          <Text style={styles.warning}>{warning}</Text>
          {onOpenSettings ? (
            <Pressable
              testID="session-message-open-settings"
              accessibilityRole="button"
              accessibilityLabel="Abrir ajustes del dispositivo"
              onPress={onOpenSettings}
              style={({ pressed }) => [
                styles.settingsButton,
                pressed && styles.settingsButtonPressed,
              ]}
            >
              <Text style={styles.settingsButtonText}>Abrir ajustes</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
      {info ? <Text style={styles.info}>{info}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    width: "100%",
  },
  warningContainer: {
    alignItems: "center",
    gap: 6,
  },
  error: {
    color: theme.colors.danger,
    fontSize: 15,
    textAlign: "center",
  },
  warning: {
    color: theme.colors.navyBrand,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  settingsButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.navyBrand,
    backgroundColor: theme.colors.white,
    marginTop: 4,
  },
  settingsButtonPressed: {
    backgroundColor: theme.colors.slate,
    opacity: 0.8,
  },
  settingsButtonText: {
    color: theme.colors.navyBrand,
    fontSize: 14,
    fontWeight: "700",
  },
  info: {
    color: theme.colors.navyBrand,
    fontSize: 15,
    textAlign: "center",
  },
});

