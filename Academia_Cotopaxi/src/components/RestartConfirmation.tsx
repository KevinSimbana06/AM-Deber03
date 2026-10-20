import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

interface RestartConfirmationProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RestartConfirmation({
  visible,
  onConfirm,
  onCancel,
}: RestartConfirmationProps) {
  return (
    <Modal
      accessibilityViewIsModal
      animationType="fade"
      onRequestClose={onCancel}
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <View accessibilityViewIsModal style={styles.dialog}>
          <Text style={styles.title}>¿Reiniciar el temporizador?</Text>
          <Text style={styles.message}>
            Se perderá el tiempo restante de la sesión actual.
          </Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityLabel="Cancelar reinicio"
              accessibilityRole="button"
              onPress={onCancel}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Confirmar reinicio"
              accessibilityRole="button"
              onPress={onConfirm}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmText}>Reiniciar</Text>
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
    fontSize: 16,
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
