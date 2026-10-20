import { StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

interface PomodoroProgressProps {
  completedPomodoros: number;
  cycleTarget: number;
}

export function PomodoroProgress({
  completedPomodoros,
  cycleTarget,
}: PomodoroProgressProps) {
  const completed = Math.max(0, Math.min(completedPomodoros, cycleTarget));

  return (
    <View accessibilityLabel="Progreso del ciclo" style={styles.container}>
      <View accessibilityLabel={`${completed} de ${cycleTarget} pomodoros`}>
        <View style={styles.dots}>
          {Array.from({ length: cycleTarget }, (_, index) => (
            <View
              key={index}
              style={[styles.dot, index < completed ? styles.completed : styles.pending]}
            />
          ))}
        </View>
        <Text style={styles.label}>{completed} de {cycleTarget} pomodoros</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 24,
  },
  dots: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  dot: {
    borderRadius: 8,
    height: 16,
    width: 16,
  },
  completed: {
    backgroundColor: theme.colors.gold,
  },
  pending: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.slate,
    borderWidth: 2,
  },
  label: {
    color: theme.colors.navyBrand,
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
});
