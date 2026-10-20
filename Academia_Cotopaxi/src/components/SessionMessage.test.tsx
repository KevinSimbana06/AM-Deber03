import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { SessionMessage } from "./SessionMessage";

describe("SessionMessage component", () => {
  it("renders null when there are no messages", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SessionMessage error={null} warning={null} info={null} />,
      );
    });
    expect(renderer.toJSON()).toBeNull();
  });

  it("renders error message with accessible text", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SessionMessage error="Error al guardar la sesión." />,
      );
    });
    const textNode = renderer.root.findByProps({ children: "Error al guardar la sesión." });
    expect(textNode).toBeDefined();
  });

  it("renders warning message when clock shifted or permissions missing", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SessionMessage warning="Se detectó un cambio en el reloj del dispositivo." />,
      );
    });
    const textNode = renderer.root.findByProps({
      children: "Se detectó un cambio en el reloj del dispositivo.",
    });
    expect(textNode).toBeDefined();
  });

  it("renders info message when phase completed in absence or cycle expired", () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SessionMessage info="La fase anterior terminó mientras la aplicación no estaba activa." />,
      );
    });
    const textNode = renderer.root.findByProps({
      children: "La fase anterior terminó mientras la aplicación no estaba activa.",
    });
    expect(textNode).toBeDefined();
  });

  it("renders 'Abrir ajustes' button when onOpenSettings callback is provided with a warning (RF-003)", () => {
    const onOpenSettings = jest.fn();
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <SessionMessage
          warning="No recibirás avisos fuera de la app. Puedes activarlos en los ajustes."
          onOpenSettings={onOpenSettings}
        />,
      );
    });

    const settingsButton = renderer.root.findByProps({ testID: "session-message-open-settings" });
    expect(settingsButton).toBeDefined();

    act(() => {
      settingsButton.props.onPress();
    });
    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });
});
