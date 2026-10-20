import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { AlarmActiveModal } from "./AlarmActiveModal";

describe("AlarmActiveModal component (RF-008, RF-009)", () => {
  it("does not display content when visible is false", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <AlarmActiveModal visible={false} completedPhase="study" onStop={() => {}} />,
      );
    });
    const modal = renderer.root.findByProps({ testID: "alarm-modal" });
    expect(modal.props.visible).toBe(false);
  });

  it("renders prominent title and button when visible is true", () => {
    const onStop = jest.fn();
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <AlarmActiveModal visible={true} completedPhase="study" onStop={onStop} />,
      );
    });

    const title = renderer.root.findByProps({ testID: "alarm-modal-title" });
    expect(title.props.children).toBe("¡Fase finalizada!");

    const button = renderer.root.findByProps({ testID: "alarm-stop-button" });
    expect(button.props.accessibilityLabel).toBe("Detener aviso de fin de fase");

    act(() => {
      button.props.onPress();
    });
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it("presents specific message when completed phase is study", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <AlarmActiveModal visible={true} completedPhase="study" onStop={() => {}} />,
      );
    });
    const message = renderer.root.findByProps({ testID: "alarm-modal-message" });
    expect(message.props.children).toContain("estudio");
  });

  it("presents specific message when completed phase is a break", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <AlarmActiveModal visible={true} completedPhase="shortBreak" onStop={() => {}} />,
      );
    });
    const message = renderer.root.findByProps({ testID: "alarm-modal-message" });
    expect(message.props.children).toContain("descanso");
  });
});
