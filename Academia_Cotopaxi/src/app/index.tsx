import { useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StudyTimer } from "../components/StudyTimer";
import { RestartConfirmation } from "../components/RestartConfirmation";
import { SessionMessage } from "../components/SessionMessage";
import { StudyTimerControls } from "../components/StudyTimerControls";
import { PomodoroProgress } from "../components/PomodoroProgress";
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
  const { session, loading, error, warning, start, pause, reset } = useStudySession();
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
          <Text style={styles.eyebrow}>ACADEMIA COTOPAXI</Text>
          <Text style={styles.title}>Pomodoro</Text>
        </View>
        <StudyTimer
          phase={session.phase}
          phaseLabel={getPhaseLabel(session.phase)}
          status={session.status}
          timeText={formatTime(session.remainingSeconds)}
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
        <SessionMessage error={error} warning={warning} />
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
    fontSize: 16,
    marginTop: 24,
    textAlign: "center",
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
