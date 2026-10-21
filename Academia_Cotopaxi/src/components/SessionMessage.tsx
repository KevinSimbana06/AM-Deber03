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

  const isNotificationWarning =
    !!warning && (warning.includes("avisos fuera de la app") || !!onOpenSettings);

  return (
    <View accessibilityLiveRegion="polite" style={styles.container}>
      {error ? (
        <View style={styles.errorCard}>
          <View style={styles.errorIconContainer}>
            <Text style={styles.cardIcon}>⚠️</Text>
          </View>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {warning ? (
        <View style={styles.warningCard}>
          <View style={styles.warningIconContainer}>
            <Text style={styles.cardIcon}>{isNotificationWarning ? "🔔" : "⚠️"}</Text>
          </View>
          <View style={styles.warningContent}>
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
        </View>
      ) : null}

      {info ? (
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Text style={styles.cardIcon}>ℹ️</Text>
          </View>
          <Text style={styles.infoText}>{info}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    width: "100%",
  },
  warningCard: {
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.slate,
    borderRadius: 16,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: 12,
    padding: 14,
    shadowColor: theme.colors.navyBrand,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  warningIconContainer: {
    alignItems: "center",
    backgroundColor: "rgba(118, 120, 166, 0.18)",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  cardIcon: {
    fontSize: 18,
  },
  warningContent: {
    flex: 1,
    gap: 8,
  },
  warning: {
    color: theme.colors.navyBrand,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 19,
  },
  settingsButton: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.navyBrand,
    borderRadius: 10,
    justifyContent: "center",
    minHeight: 38,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  settingsButtonPressed: {
    opacity: 0.8,
  },
  settingsButtonText: {
    color: theme.colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  errorCard: {
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.danger,
    borderRadius: 16,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  errorIconContainer: {
    alignItems: "center",
    backgroundColor: "rgba(211, 55, 36, 0.15)",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  errorText: {
    color: theme.colors.danger,
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 19,
  },
  infoCard: {
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.slate,
    borderRadius: 16,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  infoIconContainer: {
    alignItems: "center",
    backgroundColor: "rgba(118, 120, 166, 0.18)",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  infoText: {
    color: theme.colors.navyBrand,
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 19,
  },
});


