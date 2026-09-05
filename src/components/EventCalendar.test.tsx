/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import EventCalendar from "./EventCalendar.tsx";

describe("EventCalendar", () => {
  let container: HTMLDivElement;
  let root: Root;

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  function renderCalendar() {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root.render(
        <EventCalendar
          eventName="Test Stream"
          eventDate="2026-09-09T14:00:00.000Z"
          duration={60}
          description="A test stream"
          location="https://nickyt.co"
        />
      );
    });
  }

  it("opens the menu on the first click after focus", () => {
    renderCalendar();

    const button = container.querySelector("button");
    expect(button).not.toBeNull();
    expect(button?.getAttribute("aria-expanded")).toBe("false");

    act(() => {
      button?.focus();
      button?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true })
      );
    });

    expect(button?.getAttribute("aria-expanded")).toBe("true");
    expect(container.querySelector('[role="menu"]')).not.toBeNull();
  });

  it("keeps the menu open when clicking while already focused", () => {
    renderCalendar();

    const button = container.querySelector("button");
    expect(button).not.toBeNull();

    act(() => {
      button?.focus();
    });
    expect(button?.getAttribute("aria-expanded")).toBe("true");

    act(() => {
      button?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true })
      );
    });

    expect(button?.getAttribute("aria-expanded")).toBe("true");
    expect(container.querySelector('[role="menu"]')).not.toBeNull();
  });
});
