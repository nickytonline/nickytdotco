/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import EventCalendar from "./EventCalendar.tsx";

const props = {
  eventName: "Test Stream",
  eventDate: "2026-09-09T14:00:00.000Z",
  duration: 60,
  description: "A test stream",
  location: "https://nickyt.co",
} as const;

afterEach(() => {
  cleanup();
});

describe("EventCalendar", () => {
  it("opens the calendar menu on the first click after focus (#1104)", async () => {
    const user = userEvent.setup();
    render(<EventCalendar {...props} />);

    const button = screen.getByRole("button", {
      name: "Add Test Stream to calendar",
    });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("menu")).toBeNull();

    // userEvent focuses then clicks — the regression was focus opening
    // the menu and click toggling it closed on that same interaction.
    await user.click(button);

    expect(button.getAttribute("aria-expanded")).toBe("true");
    const menu = screen.getByRole("menu");
    expect(
      within(menu).getByRole("menuitem", { name: /google calendar/i })
    ).toBeTruthy();
    expect(
      within(menu).getByRole("menuitem", { name: /outlook calendar/i })
    ).toBeTruthy();
    expect(
      within(menu).getByRole("menuitem", { name: /ical\/apple calendar/i })
    ).toBeTruthy();
  });

  it("keeps the menu open when clicking an already focused button", async () => {
    const user = userEvent.setup();
    render(<EventCalendar {...props} />);

    const button = screen.getByRole("button", {
      name: "Add Test Stream to calendar",
    });

    await user.tab();
    expect(document.activeElement).toBe(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("menu")).toBeTruthy();

    await user.click(button);

    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("menu")).toBeTruthy();
  });

  it("opens the menu from keyboard activation", async () => {
    const user = userEvent.setup();
    render(<EventCalendar {...props} />);

    const button = screen.getByRole("button", {
      name: "Add Test Stream to calendar",
    });

    await user.tab();
    await user.keyboard("{Enter}");

    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("menu")).toBeTruthy();
  });
});
