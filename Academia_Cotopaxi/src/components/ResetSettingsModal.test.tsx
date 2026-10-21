import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { ResetSettingsModal } from "./ResetSettingsModal";

describe("ResetSettingsModal component (T5: RF-008, RF-009, RF-010, RNF-004)", () => {
  it("does not render contents when visible is false", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <ResetSettingsModal
          visible={false}
          onConfirm={jest.fn()}
          onCancel={jest.fn()}
        />,
      );
    });

    const modal = renderer.root.findByProps({ testID: "reset-settings-modal" });
    expect(modal.props.visible).toBe(false);
  });

  it("renders warning title, explanation with default values (25/5/15/4) and actions when visible", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <ResetSettingsModal
          visible={true}
          onConfirm={jest.fn()}
          onCancel={jest.fn()}
        />,
      );
    });

    const modal = renderer.root.findByProps({ testID: "reset-settings-modal" });
    expect(modal.props.visible).toBe(true);

    const title = renderer.root.findByProps({ testID: "reset-settings-title" });
    expect(title.props.children).toBe("¿Restablecer valores por defecto?");

    const message = renderer.root.findByProps({ testID: "reset-settings-message" });
    expect(message.props.children).toContain("25 min de estudio");
    expect(message.props.children).toContain("5 min de descanso corto");
    expect(message.props.children).toContain("15 min de descanso largo");
    expect(message.props.children).toContain("4 pomodoros");
  });

  it("calls onCancel when cancel button is pressed", () => {
    const onCancel = jest.fn();
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <ResetSettingsModal
          visible={true}
          onConfirm={jest.fn()}
          onCancel={onCancel}
        />,
      );
    });

    const cancelButton = renderer.root.findByProps({ testID: "reset-settings-cancel-button" });
    act(() => {
      cancelButton.props.onPress();
    });

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when destructive confirm button is pressed", () => {
    const onConfirm = jest.fn();
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <ResetSettingsModal
          visible={true}
          onConfirm={onConfirm}
          onCancel={jest.fn()}
        />,
      );
    });

    const confirmButton = renderer.root.findByProps({ testID: "reset-settings-confirm-button" });
    act(() => {
      confirmButton.props.onPress();
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
