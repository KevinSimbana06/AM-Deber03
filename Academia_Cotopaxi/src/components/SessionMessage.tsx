import { StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

interface SessionMessageProps {
  error: string | null;
  warning: string | null;
}

export function SessionMessage({ error, warning }: SessionMessageProps) {
  if (!error && !warning) {
    return null;
  }

  return (
    <View accessibilityLiveRegion="polite" style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {warning ? <Text style={styles.warning}>{warning}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    width: "100%",
  },
  error: {
    color: theme.colors.danger,
    fontSize: 15,
    textAlign: "center",
  },
  warning: {
    color: theme.colors.navyBrand,
    fontSize: 15,
    textAlign: "center",
  },
});
