import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { Text } from "react-native";
import { PomodoroProgress } from "./PomodoroProgress";

describe("PomodoroProgress", () => {
  it("shows completed pomodoros and the cycle target", () => {
    let tree!: TestRenderer.ReactTestRenderer;
    act(() => {
      tree = TestRenderer.create(
        <PomodoroProgress completedPomodoros={2} cycleTarget={4} />,
      );
    });

    expect(tree.root.findByProps({ accessibilityLabel: "Progreso del ciclo" })).toBeTruthy();
    expect(tree.root.findByType(Text).props.children.join("")).toBe("2 de 4 pomodoros");
  });
});
