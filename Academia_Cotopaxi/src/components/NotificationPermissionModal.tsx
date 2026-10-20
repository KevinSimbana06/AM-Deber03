import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

export interface NotificationPermissionModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function NotificationPermissionModal({
  visible,
  onConfirm,
  onCancel,
}: NotificationPermissionModalProps) {
  return (
    <Modal
      testID="notification-permission-modal"
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text testID="permission-modal-title" style={styles.title}>
            Avisos de la Academia Cotopaxi
          </Text>
          <Text style={styles.description}>
            Para avisarte de forma confiable cuando concluya tu tiempo de estudio o descanso, la aplicación necesita permiso para emitir avisos sonoros y de vibración tipo alarma.
          </Text>
          <Text style={styles.subtext}>
            Si decides no activarlos, podrás continuar estudiando, pero no recibirás alertas fuera de la pantalla.
          </Text>

          <View style={styles.buttonContainer}>
            <Pressable
              testID="permission-confirm-button"
              accessibilityRole="button"
              accessibilityLabel="Permitir avisos de fin de fase"
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.confirmButton,
                pressed && styles.confirmButtonPressed,
              ]}
            >
              <Text style={styles.confirmButtonText}>Permitir avisos</Text>
            </Pressable>

            <Pressable
              testID="permission-cancel-button"
              accessibilityRole="button"
              accessibilityLabel="Continuar sin avisos de fin de fase"
              onPress={onCancel}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelButtonPressed,
              ]}
            >
              <Text style={styles.cancelButtonText}>Continuar sin avisos</Text>
            </Pressable>
          </View>
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
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.navyBrand,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.navyBrand,
    textAlign: "center",
    marginBottom: 10,
  },
  subtext: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.slate,
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  confirmButton: {
    width: "100%",
    height: 56,
    backgroundColor: theme.colors.navyBrand,
    borderRadius: theme.spacing.buttonRadius,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButtonPressed: {
    opacity: 0.85,
  },
  confirmButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    width: "100%",
    height: 48,
    backgroundColor: "transparent",
    borderRadius: theme.spacing.buttonRadius,
    borderWidth: 1.5,
    borderColor: theme.colors.slate,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonPressed: {
    backgroundColor: "rgba(118, 120, 166, 0.1)",
  },
  cancelButtonText: {
    color: theme.colors.navyBrand,
    fontSize: 15,
    fontWeight: "600",
  },
});
