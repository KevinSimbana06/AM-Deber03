import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

interface ResetSettingsModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ResetSettingsModal({
  visible,
  onConfirm,
  onCancel,
}: ResetSettingsModalProps) {
  return (
    <Modal
      accessibilityViewIsModal
      animationType="fade"
      onRequestClose={onCancel}
      testID="reset-settings-modal"
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <View accessibilityViewIsModal style={styles.dialog}>
          <Text style={styles.title} testID="reset-settings-title">
            ¿Restablecer valores por defecto?
          </Text>
          <Text style={styles.message} testID="reset-settings-message">
            Los tiempos regresarán a los valores recomendados por la Academia Cotopaxi: 25 min de estudio, 5 min de descanso corto, 15 min de descanso largo y 4 pomodoros por ciclo.
          </Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityLabel="Cancelar restablecimiento"
              accessibilityRole="button"
              onPress={onCancel}
              style={styles.cancelButton}
              testID="reset-settings-cancel-button"
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Confirmar restablecimiento"
              accessibilityRole="button"
              onPress={onConfirm}
              style={styles.confirmButton}
              testID="reset-settings-confirm-button"
            >
              <Text style={styles.confirmText}>Restablecer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: theme.colors.navyBrand,
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.screen,
  },
  dialog: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 24,
    width: "100%",
  },
  title: {
    color: theme.colors.navyBrand,
    fontSize: 20,
    fontWeight: "700",
  },
  message: {
    color: theme.colors.navyBrand,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
    marginTop: 24,
  },
  cancelButton: {
    alignItems: "center",
    borderColor: theme.colors.slate,
    borderRadius: theme.spacing.buttonRadius,
    borderWidth: 2,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 16,
  },
  confirmButton: {
    alignItems: "center",
    backgroundColor: theme.colors.danger,
    borderRadius: theme.spacing.buttonRadius,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 16,
  },
  cancelText: {
    color: theme.colors.navyBrand,
    fontWeight: "700",
  },
  confirmText: {
    color: theme.colors.white,
    fontWeight: "700",
  },
});
