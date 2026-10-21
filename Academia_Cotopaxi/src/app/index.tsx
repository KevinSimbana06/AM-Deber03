import { useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { StudyTimer } from "../components/StudyTimer";
import { RestartConfirmation } from "../components/RestartConfirmation";
import { SessionMessage } from "../components/SessionMessage";
import { StudyTimerControls } from "../components/StudyTimerControls";
import { PomodoroProgress } from "../components/PomodoroProgress";
import { AlarmActiveModal } from "../components/AlarmActiveModal";
import { NotificationPermissionModal } from "../components/NotificationPermissionModal";
import { theme } from "../constants/theme";
import { useStudySession } from "../context/StudySessionContext";
import { formatTime } from "../utils/timer";
import type { PomodoroPhase } from "../types/pomodoro";

export default function Index() {
  return (
    <StudySessionScreen />
  );
}

function getPhaseLabel(phase: PomodoroPhase): string {
  if (phase === "shortBreak") return "Descanso corto";
  if (phase === "longBreak") return "Descanso largo";
  return "Estudio";
}

function StudySessionScreen() {
  const router = useRouter();
  const {
    session,
    loading,
    error,
    warning,
    info,
    isAlarmActive,
    alarmPhase,
    isPermissionModalVisible,
    start,
    pause,
    reset,
    stopAlarm,
    confirmPermissionModal,
    dismissPermissionModal,
    openNotificationSettings,
  } = useStudySession();
  const [showRestartConfirmation, setShowRestartConfirmation] = useState(false);

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator color={theme.colors.navyBrand} />
        <Text style={styles.loadingText}>Cargando sesión...</Text>
      </SafeAreaView>
    );
  }

  const confirmReset = () => {
    setShowRestartConfirmation(false);
    void reset(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View>
              <Text style={styles.eyebrow}>ACADEMIA COTOPAXI</Text>
              <Text style={styles.title}>Pomodoro</Text>
            </View>
            <Pressable
              accessibilityLabel="Abrir ajustes del pomodoro"
              accessibilityRole="button"
              onPress={() => router.push("/settings")}
              style={styles.settingsButton}
              testID="settings-nav-button"
            >
              <Text style={styles.settingsIcon}>⚙</Text>
            </Pressable>
          </View>
        </View>

        <StudyTimer
          phase={session.phase}
          phaseLabel={getPhaseLabel(session.phase)}
          status={session.status}
          timeText={formatTime(session.remainingSeconds)}
          remainingSeconds={session.remainingSeconds}
          initialDurationSeconds={session.initialDurationSeconds}
        />
        <PomodoroProgress
          completedPomodoros={session.completedPomodoros}
          cycleTarget={session.cycleTarget}
        />
        <Text style={styles.description}>
          {session.status === "finished"
            ? "La sesión terminó. Reinicia para comenzar otra."
            : "Concéntrate en tu sesión de estudio."}
        </Text>
        <View style={styles.messageWrapper}>
          <SessionMessage
            error={error}
            warning={warning}
            info={info}
            onOpenSettings={() => void openNotificationSettings()}
          />
        </View>
        <View style={styles.spacer} />
        <StudyTimerControls
          hasTimeRemaining={session.remainingSeconds > 0}
          onPause={() => void pause()}
          onReset={() => setShowRestartConfirmation(true)}
          onStart={() => void start()}
          status={session.status}
        />
      </View>
      <RestartConfirmation
        onCancel={() => setShowRestartConfirmation(false)}
        onConfirm={confirmReset}
        visible={showRestartConfirmation}
      />
      <AlarmActiveModal
        visible={isAlarmActive}
        completedPhase={alarmPhase}
        onStop={stopAlarm}
      />
      <NotificationPermissionModal
        visible={isPermissionModalVisible}
        onConfirm={() => void confirmPermissionModal()}
        onCancel={() => void dismissPermissionModal()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  container: {
    flex: 1,
    padding: theme.spacing.screen,
  },
  header: {
    marginBottom: 36,
  },
  headerTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  settingsButton: {
    alignItems: "center",
    backgroundColor: theme.colors.navyBrand,
    borderColor: theme.colors.slate,
    borderRadius: 22,
    borderWidth: 1.5,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  settingsIcon: {
    color: theme.colors.white,
    fontSize: 20,
  },
  eyebrow: {
    color: theme.colors.navyBrand,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  title: {
    color: theme.colors.navyBrand,
    fontSize: 32,
    fontWeight: "800",
    marginTop: 4,
  },

  description: {
    color: theme.colors.navyBrand,
    fontSize: 15,
    marginTop: 14,
    textAlign: "center",
  },
  messageWrapper: {
    marginTop: 12,
    width: "100%",
  },
  spacer: {
    flex: 1,
  },
  loading: {
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
