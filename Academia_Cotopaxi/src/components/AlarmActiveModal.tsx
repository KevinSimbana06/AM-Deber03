import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";
import type { PomodoroPhase } from "../types/pomodoro";

export interface AlarmActiveModalProps {
  visible: boolean;
  completedPhase: PomodoroPhase | null;
  onStop: () => void;
}

export function AlarmActiveModal({
  visible,
  completedPhase,
  onStop,
}: AlarmActiveModalProps) {
  const isStudy = completedPhase === "study";
  const message = isStudy
    ? "Has completado la sesión de estudio. ¡Gran trabajo! La siguiente fase de descanso está preparada."
    : "El tiempo de descanso ha finalizado. La siguiente sesión de estudio está preparada.";

  return (
    <Modal
      testID="alarm-modal"
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text testID="alarm-modal-title" style={styles.title}>
            ¡Fase finalizada!
          </Text>
          <Text testID="alarm-modal-message" style={styles.message}>
            {message}
          </Text>
          <Pressable
            testID="alarm-stop-button"
            accessibilityRole="button"
            accessibilityLabel="Detener aviso de fin de fase"
            onPress={onStop}
            style={({ pressed }) => [
              styles.stopButton,
              pressed && styles.stopButtonPressed,
            ]}
          >
            <Text style={styles.stopButtonText}>Detener aviso</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(20, 23, 89, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.screen,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    elevation: 8,
    shadowColor: theme.colors.navyBrand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.navyBrand,
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    color: theme.colors.navyBrand,
    textAlign: "center",
    marginBottom: 24,
  },
  stopButton: {
    width: "100%",
    height: 56,
    backgroundColor: theme.colors.navyBrand,
    borderRadius: theme.spacing.buttonRadius,
    justifyContent: "center",
    alignItems: "center",
  },
  stopButtonPressed: {
    opacity: 0.85,
  },
  stopButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
});
