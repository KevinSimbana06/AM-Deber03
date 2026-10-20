import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";
import type { SessionStatus } from "../types/pomodoro";

interface StudyTimerControlsProps {
  status: SessionStatus;
  hasTimeRemaining: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function StudyTimerControls({
  status,
  hasTimeRemaining,
  onStart,
  onPause,
  onReset,
}: StudyTimerControlsProps) {
  const canStart = hasTimeRemaining && (status === "stopped" || status === "paused");
  const canPause = hasTimeRemaining && status === "running";
  const actionLabel = status === "paused" ? "Reanudar" : "Iniciar";

  return (
    <View style={styles.container}>
      {canPause ? (
        <Pressable
          accessibilityLabel="Pausar"
          accessibilityRole="button"
          onPress={onPause}
          style={[styles.button, styles.pauseButton]}
        >
          <Text style={styles.pauseText}>Pausar</Text>
        </Pressable>
      ) : (
        <Pressable
          accessibilityLabel={actionLabel}
          accessibilityRole="button"
          disabled={!canStart}
          onPress={onStart}
          style={[styles.button, styles.primaryButton, !canStart && styles.disabledButton]}
        >
          <Text style={styles.primaryText}>{actionLabel}</Text>
        </Pressable>
      )}
      <Pressable
        accessibilityLabel="Reiniciar"
        accessibilityRole="button"
        onPress={onReset}
        style={[styles.button, styles.resetButton]}
      >
        <Text style={styles.resetText}>Reiniciar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    width: "100%",
  },
  button: {
    alignItems: "center",
    borderRadius: theme.spacing.buttonRadius,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: theme.colors.navyBrand,
    minHeight: 56,
  },
  pauseButton: {
    backgroundColor: theme.colors.gold,
    minHeight: 56,
  },
  resetButton: {
    backgroundColor: theme.colors.danger,
  },
  disabledButton: {
    opacity: 0.45,
  },
  primaryText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  pauseText: {
    color: theme.colors.navyBrand,
    fontSize: 18,
    fontWeight: "700",
  },
  resetText: {
    color: theme.colors.white,
    fontSize: 17,
    fontWeight: "700",
  },
});
