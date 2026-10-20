import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { NotificationPermissionModal } from "./NotificationPermissionModal";

describe("NotificationPermissionModal component (RF-001, RF-002, RF-003)", () => {
  it("does not show content when visible is false", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <NotificationPermissionModal
          visible={false}
          onConfirm={() => {}}
          onCancel={() => {}}
        />,
      );
    });

    const modal = renderer.root.findByProps({ testID: "notification-permission-modal" });
    expect(modal.props.visible).toBe(false);
  });

  it("renders title, description and triggers onConfirm on 'Permitir avisos'", () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    let renderer!: TestRenderer.ReactTestRenderer;

    act(() => {
      renderer = TestRenderer.create(
        <NotificationPermissionModal
          visible={true}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />,
      );
    });

    const title = renderer.root.findByProps({ testID: "permission-modal-title" });
    expect(title.props.children).toBe("Avisos de la Academia Cotopaxi");

    const confirmButton = renderer.root.findByProps({ testID: "permission-confirm-button" });
    expect(confirmButton.props.accessibilityLabel).toBe("Permitir avisos de fin de fase");

    act(() => {
      confirmButton.props.onPress();
    });
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("triggers onCancel when pressing 'Continuar sin avisos'", () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    let renderer!: TestRenderer.ReactTestRenderer;

    act(() => {
      renderer = TestRenderer.create(
        <NotificationPermissionModal
          visible={true}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />,
      );
    });

    const cancelButton = renderer.root.findByProps({ testID: "permission-cancel-button" });
    expect(cancelButton.props.accessibilityLabel).toBe("Continuar sin avisos de fin de fase");

    act(() => {
      cancelButton.props.onPress();
    });
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
