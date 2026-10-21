import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { SettingsForm } from "./SettingsForm";
import { DEFAULT_POMODORO_SETTINGS } from "../utils/cycleSettings";

describe("SettingsForm component (T4: RF-002, RF-003, RF-004, RNF-003)", () => {
  const initialSettings = { ...DEFAULT_POMODORO_SETTINGS };


  it("renders 4 numeric input fields with initial values", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SettingsForm
          initialSettings={initialSettings}
          onSave={jest.fn()}
          onResetRequest={jest.fn()}
        />,
      );
    });

    const studyInput = renderer.root.findByProps({ testID: "input-study-duration" });
    const shortBreakInput = renderer.root.findByProps({ testID: "input-short-break" });
    const longBreakInput = renderer.root.findByProps({ testID: "input-long-break" });
    const cycleInput = renderer.root.findByProps({ testID: "input-cycle-target" });

    expect(studyInput.props.value).toBe("25");
    expect(shortBreakInput.props.value).toBe("5");
    expect(longBreakInput.props.value).toBe("15");
    expect(cycleInput.props.value).toBe("4");

    expect(studyInput.props.keyboardType).toBe("number-pad");
    expect(shortBreakInput.props.keyboardType).toBe("number-pad");
    expect(longBreakInput.props.keyboardType).toBe("number-pad");
    expect(cycleInput.props.keyboardType).toBe("number-pad");
  });

  it("enables save button when all initial fields are valid", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SettingsForm
          initialSettings={initialSettings}
          onSave={jest.fn()}
          onResetRequest={jest.fn()}
        />,
      );
    });

    const saveButton = renderer.root.findByProps({ testID: "button-save-settings" });
    expect(saveButton.props.accessibilityState?.disabled).toBe(false);
  });

  it("validates reactively and displays inline error when typing out of range", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SettingsForm
          initialSettings={initialSettings}
          onSave={jest.fn()}
          onResetRequest={jest.fn()}
        />,
      );
    });

    const studyInput = renderer.root.findByProps({ testID: "input-study-duration" });

    // Type 10 (study must be 25-90)
    act(() => {
      studyInput.props.onChangeText("10");
    });

    const studyError = renderer.root.findByProps({ testID: "error-study-duration" });
    expect(studyError.props.children).toContain("25 y 90");

    const saveButton = renderer.root.findByProps({ testID: "button-save-settings" });
    expect(saveButton.props.accessibilityState?.disabled).toBe(true);
  });

  it("clears error and re-enables save button when valid input is restored", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SettingsForm
          initialSettings={initialSettings}
          onSave={jest.fn()}
          onResetRequest={jest.fn()}
        />,
      );
    });

    const studyInput = renderer.root.findByProps({ testID: "input-study-duration" });

    // Make invalid
    act(() => {
      studyInput.props.onChangeText("999");
    });
    let saveButton = renderer.root.findByProps({ testID: "button-save-settings" });
    expect(saveButton.props.accessibilityState?.disabled).toBe(true);

    // Restore to valid 45
    act(() => {
      studyInput.props.onChangeText("45");
    });

    const errorNodes = renderer.root.findAllByProps({ testID: "error-study-duration" });
    expect(errorNodes.length).toBe(0);

    saveButton = renderer.root.findByProps({ testID: "button-save-settings" });
    expect(saveButton.props.accessibilityState?.disabled).toBe(false);
  });

  it("calls onSave with parsed numeric settings when save button is pressed", () => {
    const onSave = jest.fn();
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SettingsForm
          initialSettings={initialSettings}
          onSave={onSave}
          onResetRequest={jest.fn()}
        />,
      );
    });

    const studyInput = renderer.root.findByProps({ testID: "input-study-duration" });
    const shortBreakInput = renderer.root.findByProps({ testID: "input-short-break" });

    act(() => {
      studyInput.props.onChangeText("50");
      shortBreakInput.props.onChangeText("10");
    });

    const saveButton = renderer.root.findByProps({ testID: "button-save-settings" });
    act(() => {
      saveButton.props.onPress();
    });

    expect(onSave).toHaveBeenCalledWith({
      studyDurationMinutes: 50,
      shortBreakMinutes: 10,
      longBreakMinutes: 15,
      cycleTarget: 4,
    });
  });

  it("triggers onResetRequest when reset button is pressed", () => {
    const onResetRequest = jest.fn();
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SettingsForm
          initialSettings={initialSettings}
          onSave={jest.fn()}
          onResetRequest={onResetRequest}
        />,
      );
    });

    const resetButton = renderer.root.findByProps({ testID: "button-reset-settings" });
    act(() => {
      resetButton.props.onPress();
    });

    expect(onResetRequest).toHaveBeenCalledTimes(1);
  });
});
