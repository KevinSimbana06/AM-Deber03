import { StyleSheet, Text, View } from "react-native";
import type { PomodoroPhase, SessionStatus } from "../types/pomodoro";
import { theme } from "../constants/theme";

export interface StudyTimerProps {
  timeText: string;
  phaseLabel: string;
  phase: PomodoroPhase;
  status: SessionStatus;
  progress?: number;
  remainingSeconds?: number;
  initialDurationSeconds?: number;
}

export function StudyTimer({
  timeText,
  phaseLabel,
  phase,
  status,
  progress,
  remainingSeconds,
  initialDurationSeconds,
}: StudyTimerProps) {
  const isStudy = phase === "study";
  const progressColor = isStudy ? theme.colors.gold : theme.colors.slate;

  const calculatedRatio =
    typeof progress === "number"
      ? progress
      : initialDurationSeconds && initialDurationSeconds > 0
        ? (remainingSeconds ?? 0) / initialDurationSeconds
        : 1;

  const clampedProgress = Math.max(0, Math.min(1, calculatedRatio));
  const angle = clampedProgress * 360;
  const rightRotate = Math.min(180, Math.max(0, angle - 90));
  const leftRotate = Math.min(180, Math.max(0, angle - 270));

  return (
    <View style={styles.container}>
      <Text style={[styles.phase, !isStudy && styles.breakPhase]}>{phaseLabel}</Text>

      {/* Círculo del reloj de 280 px con anillo de progreso de 10 px */}
      <View accessibilityLabel={`Tiempo restante ${timeText}`} style={styles.clockContainer}>
        {/* Pista del anillo de progreso (35% opacidad) */}
        <View style={styles.trackRing} />

        {/* Anillo de progreso circular activo */}
        {clampedProgress > 0 ? (
          <>
            {/* Mitad derecha (0° - 180°) */}
            <View style={styles.halfContainerRight}>
              <View
                style={[
                  styles.progressRingCircle,
                  styles.progressRingCircleRight,
                  {
                    borderColor: progressColor,
                    transform: [{ rotate: `${rightRotate}deg` }],
                  },
                ]}
              />
            </View>

            {/* Mitad izquierda (180° - 360°) */}
            {angle > 180 ? (
              <View style={styles.halfContainerLeft}>
                <View
                  style={[
                    styles.progressRingCircle,
                    styles.progressRingCircleLeft,
                    {
                      borderColor: progressColor,
                      transform: [{ rotate: `${leftRotate}deg` }],
                    },
                  ]}
                />
              </View>
            ) : null}
          </>
        ) : null}

        {/* Círculo central oscuro con el tiempo y barra interior sutil */}
        <View style={styles.clockCenter}>
          <Text style={styles.time}>{timeText}</Text>
          {/* Barra sutil interior que se reduce con el tiempo */}
          <View style={styles.innerBarTrack}>
            <View
              style={[
                styles.innerBarFill,
                {
                  width: `${Math.round(clampedProgress * 100)}%`,
                  backgroundColor: progressColor,
                },
              ]}
            />
          </View>
        </View>
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
    gap: 20,
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
  clockContainer: {
    alignItems: "center",
    height: 280,
    justifyContent: "center",
    position: "relative",
    width: 280,
  },
  trackRing: {
    borderColor: "rgba(118, 120, 166, 0.35)",
    borderRadius: 140,
    borderWidth: 10,
    height: 280,
    position: "absolute",
    width: 280,
  },
  halfContainerRight: {
    height: 280,
    left: 140,
    overflow: "hidden",
    position: "absolute",
    top: 0,
    width: 140,
  },
  halfContainerLeft: {
    height: 280,
    left: 0,
    overflow: "hidden",
    position: "absolute",
    top: 0,
    width: 140,
  },
  progressRingCircle: {
    borderRadius: 140,
    borderWidth: 10,
    height: 280,
    position: "absolute",
    top: 0,
    width: 280,
  },
  progressRingCircleRight: {
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    left: -140,
  },
  progressRingCircleLeft: {
    borderRightColor: "transparent",
    borderTopColor: "transparent",
    left: 0,
  },
  clockCenter: {
    alignItems: "center",
    backgroundColor: theme.colors.navyBrand,
    borderRadius: 128,
    height: 256,
    justifyContent: "center",
    width: 256,
  },
  time: {
    color: theme.colors.white,
    fontSize: 62,
    fontVariant: ["tabular-nums"],
    fontWeight: "800",
  },
  innerBarTrack: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    height: 5,
    marginTop: 12,
    overflow: "hidden",
    width: 120,
  },
  innerBarFill: {
    borderRadius: 3,
    height: "100%",
  },
  status: {
    color: theme.colors.navyBrand,
    fontSize: 17,
    fontWeight: "600",
  },
});

