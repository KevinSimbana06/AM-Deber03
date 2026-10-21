import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { theme } from "../constants/theme";
import {
  PomodoroSettings,
  SettingsFieldErrors,
  SettingsFormInput,
} from "../types/pomodoro";
import {
  parseSettingsForm,
  validateSettingsForm,
} from "../utils/cycleSettings";

interface SettingsFormProps {
  initialSettings: PomodoroSettings;
  onSave: (settings: PomodoroSettings) => void;
  onResetRequest: () => void;
}

export function SettingsForm({
  initialSettings,
  onSave,
  onResetRequest,
}: SettingsFormProps) {
  const [form, setForm] = useState<SettingsFormInput>({
    studyDurationMinutes: String(initialSettings.studyDurationMinutes),
    shortBreakMinutes: String(initialSettings.shortBreakMinutes),
    longBreakMinutes: String(initialSettings.longBreakMinutes),
    cycleTarget: String(initialSettings.cycleTarget),
  });

  const [errors, setErrors] = useState<SettingsFieldErrors>({});

  const handleChange = (field: keyof SettingsFormInput, text: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: text };
      const validation = validateSettingsForm(updated);
      setErrors(validation.errors);
      return updated;
    });
  };


  const validation = validateSettingsForm(form);
  const isValid = validation.isValid;

  const handleSave = () => {
    if (!isValid) return;
    const parsed = parseSettingsForm(form);
    if (parsed) {
      onSave(parsed);
    }
  };

  return (
    <View style={styles.container}>
      {/* Campo: Estudio */}
      <View style={styles.fieldContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Tiempo de estudio (minutos)</Text>
          <Text style={styles.rangeHint}>25 - 90 min</Text>
        </View>
        <TextInput
          accessibilityLabel="Tiempo de estudio en minutos"
          keyboardType="number-pad"
          maxLength={3}
          onChangeText={(text) => handleChange("studyDurationMinutes", text)}
          style={[
            styles.input,
            errors.studyDurationMinutes ? styles.inputError : null,
          ]}
          testID="input-study-duration"
          value={form.studyDurationMinutes}
        />
        {errors.studyDurationMinutes ? (
          <Text
            accessibilityRole="alert"
            style={styles.errorText}
            testID="error-study-duration"
          >
            {errors.studyDurationMinutes}
          </Text>
        ) : null}
      </View>

      {/* Campo: Descanso Corto */}
      <View style={styles.fieldContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Descanso corto (minutos)</Text>
          <Text style={styles.rangeHint}>5 - 20 min</Text>
        </View>
        <TextInput
          accessibilityLabel="Descanso corto en minutos"
          keyboardType="number-pad"
          maxLength={3}
          onChangeText={(text) => handleChange("shortBreakMinutes", text)}
          style={[
            styles.input,
            errors.shortBreakMinutes ? styles.inputError : null,
          ]}
          testID="input-short-break"
          value={form.shortBreakMinutes}
        />
        {errors.shortBreakMinutes ? (
          <Text
            accessibilityRole="alert"
            style={styles.errorText}
            testID="error-short-break"
          >
            {errors.shortBreakMinutes}
          </Text>
        ) : null}
      </View>

      {/* Campo: Descanso Largo */}
      <View style={styles.fieldContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Descanso largo (minutos)</Text>
          <Text style={styles.rangeHint}>15 - 30 min</Text>
        </View>
        <TextInput
          accessibilityLabel="Descanso largo en minutos"
          keyboardType="number-pad"
          maxLength={3}
          onChangeText={(text) => handleChange("longBreakMinutes", text)}
          style={[
            styles.input,
            errors.longBreakMinutes ? styles.inputError : null,
          ]}
          testID="input-long-break"
          value={form.longBreakMinutes}
        />
        {errors.longBreakMinutes ? (
          <Text
            accessibilityRole="alert"
            style={styles.errorText}
            testID="error-long-break"
          >
            {errors.longBreakMinutes}
          </Text>
        ) : null}
      </View>

      {/* Campo: Pomodoros por ciclo */}
      <View style={styles.fieldContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Pomodoros por ciclo</Text>
          <Text style={styles.rangeHint}>2 - 8 pomodoros</Text>
        </View>
        <TextInput
          accessibilityLabel="Cantidad de pomodoros por ciclo"
          keyboardType="number-pad"
          maxLength={2}
          onChangeText={(text) => handleChange("cycleTarget", text)}
          style={[
            styles.input,
            errors.cycleTarget ? styles.inputError : null,
          ]}
          testID="input-cycle-target"
          value={form.cycleTarget}
        />
        {errors.cycleTarget ? (
          <Text
            accessibilityRole="alert"
            style={styles.errorText}
            testID="error-cycle-target"
          >
            {errors.cycleTarget}
          </Text>
        ) : null}
      </View>

      {/* Acciones */}
      <View style={styles.actionsContainer}>
        <Pressable
          accessibilityLabel="Guardar ajustes"
          accessibilityRole="button"
          accessibilityState={{ disabled: !isValid }}
          disabled={!isValid}
          onPress={handleSave}
          style={[
            styles.saveButton,
            !isValid ? styles.buttonDisabled : null,
          ]}
          testID="button-save-settings"
        >
          <Text
            style={[
              styles.saveButtonText,
              !isValid ? styles.buttonTextDisabled : null,
            ]}
          >
            Guardar ajustes
          </Text>
        </Pressable>

        <Pressable
          accessibilityLabel="Restablecer valores por defecto"
          accessibilityRole="button"
          onPress={onResetRequest}
          style={styles.resetButton}
          testID="button-reset-settings"
        >
          <Text style={styles.resetButtonText}>
            Restablecer valores por defecto
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  labelRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: theme.colors.navyBrand,
    fontSize: 16,
    fontWeight: "600",
  },
  rangeHint: {
    color: theme.colors.slate,
    fontSize: 13,
    fontWeight: "500",
  },
  input: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.slate,
    borderRadius: 12,
    borderWidth: 2,
    color: theme.colors.navyBrand,
    fontSize: 18,
    fontWeight: "700",
    height: 48,
    paddingHorizontal: 16,
    textAlign: "center",
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 6,
  },
  actionsContainer: {
    gap: 14,
    marginTop: 16,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: theme.colors.navyBrand,
    borderRadius: theme.spacing.buttonRadius,
    height: 56,
    justifyContent: "center",
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  buttonDisabled: {
    backgroundColor: theme.colors.slate,
    opacity: 0.6,
  },
  buttonTextDisabled: {
    color: theme.colors.inkDark,
  },
  resetButton: {
    alignItems: "center",
    backgroundColor: theme.colors.danger,
    borderRadius: theme.spacing.buttonRadius,
    height: 48,
    justifyContent: "center",
  },
  resetButtonText: {
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
});
