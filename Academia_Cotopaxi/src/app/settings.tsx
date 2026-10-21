import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SettingsForm } from "../components/SettingsForm";
import { ResetSettingsModal } from "../components/ResetSettingsModal";
import { SessionMessage } from "../components/SessionMessage";
import { theme } from "../constants/theme";
import { useSettings } from "../context/SettingsContext";
import type { PomodoroSettings } from "../types/pomodoro";

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, loading, warning, saveSettings, resetToDefaults } = useSettings();
  const [showResetModal, setShowResetModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color={theme.colors.navyBrand} />
        <Text style={styles.loadingText}>Cargando ajustes...</Text>
      </SafeAreaView>
    );
  }

  const handleSave = async (newSettings: PomodoroSettings) => {
    await saveSettings(newSettings);
    setSuccessMessage("Ajustes guardados");
    setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    }, 400);
  };

  const handleConfirmReset = async () => {
    setShowResetModal(false);
    await resetToDefaults();
    setSuccessMessage("Valores por defecto restablecidos");
    setTimeout(() => {
      setSuccessMessage(null);
    }, 2500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Cabecera */}
          <View style={styles.header}>
            <Pressable
              accessibilityLabel="Volver a la pantalla principal"
              accessibilityRole="button"
              onPress={() => router.back()}
              style={styles.backButton}
              testID="settings-back-button"
            >
              <Text style={styles.backButtonText}>← Volver</Text>
            </Pressable>
            <Text style={styles.eyebrow}>ACADEMIA COTOPAXI</Text>
            <Text style={styles.title}>Ajustes de tiempo</Text>
            <Text style={styles.subtitle}>
              Personaliza la duración de cada bloque según tu propio ritmo de concentración.
            </Text>
          </View>

          {/* Notificación de éxito */}
          {successMessage ? (
            <View
              accessibilityRole="alert"
              style={styles.successBanner}
              testID="settings-success-banner"
            >
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}

          {/* Advertencia no bloqueante de almacenamiento */}
          {warning ? (
            <View style={styles.warningContainer}>
              <SessionMessage warning={warning} />
            </View>
          ) : null}

          {/* Formulario */}
          <SettingsForm
            initialSettings={settings}
            key={JSON.stringify(settings)}
            onResetRequest={() => setShowResetModal(true)}
            onSave={(newSettings) => void handleSave(newSettings)}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <ResetSettingsModal
        onCancel={() => setShowResetModal(false)}
        onConfirm={() => void handleConfirmReset()}
        visible={showResetModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.screen,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
    minHeight: 44,
    justifyContent: "center",
    paddingVertical: 8,
  },
  backButtonText: {
    color: theme.colors.navyBrand,
    fontSize: 16,
    fontWeight: "700",
  },
  eyebrow: {
    color: theme.colors.navyBrand,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  title: {
    color: theme.colors.navyBrand,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 4,
  },
  subtitle: {
    color: theme.colors.slate,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  successBanner: {
    backgroundColor: theme.colors.gold,
    borderRadius: 12,
    marginBottom: 20,
    padding: 14,
  },
  warningContainer: {
    marginBottom: 20,
  },
  successText: {
    color: theme.colors.navyBrand,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.white,
    flex: 1,
    gap: 12,
    justifyContent: "center",
  },
  loadingText: {
    color: theme.colors.navyBrand,
    fontSize: 16,
  },
});
