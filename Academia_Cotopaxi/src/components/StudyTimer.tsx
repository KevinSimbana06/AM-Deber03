import { StyleSheet, Text, View } from "react-native";
import type { PomodoroPhase, SessionStatus } from "../types/pomodoro";
import { theme } from "../constants/theme";

interface StudyTimerProps {
  timeText: string;
  phaseLabel: string;
  phase: PomodoroPhase;
  status: SessionStatus;
}

export function StudyTimer({ timeText, phaseLabel, phase, status }: StudyTimerProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.phase, phase !== "study" && styles.breakPhase]}>{phaseLabel}</Text>
      <View accessibilityLabel={`Tiempo restante ${timeText}`} style={styles.clock}>
        <Text style={styles.time}>{timeText}</Text>
      </View>
      <Text style={styles.status}>{getStatusLabel(status)}</Text>
    </View>
  );
}

function getStatusLabel(status: SessionStatus): string {
  switch (status) {
    case "running":
      return "En curso";
    case "paused":
      return "Pausado";
    case "finished":
      return "Finalizado";
    default:
      return "Detenido";
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 24,
  },
  phase: {
    backgroundColor: theme.colors.gold,
    borderRadius: 20,
    color: theme.colors.navyBrand,
    fontSize: 18,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  breakPhase: {
    backgroundColor: theme.colors.slate,
    color: theme.colors.inkDark,
  },
  clock: {
    alignItems: "center",
    backgroundColor: theme.colors.navyBrand,
    borderRadius: 140,
    height: 280,
    justifyContent: "center",
    width: 280,
  },
  time: {
    color: theme.colors.white,
    fontSize: 64,
    fontVariant: ["tabular-nums"],
    fontWeight: "800",
  },
  status: {
    color: theme.colors.navyBrand,
    fontSize: 17,
  },
});
