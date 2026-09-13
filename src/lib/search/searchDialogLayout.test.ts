import { describe, expect, it } from "vitest";
import {
  SEARCH_DIALOG_BASE_INSET_PX,
  SEARCH_DIALOG_KEYBOARD_BOTTOM_INSET_PX,
  SEARCH_DIALOG_KEYBOARD_CONTENT_PB_PX,
  getSearchDialogLayout,
} from "./searchDialogLayout";

describe("getSearchDialogLayout", () => {
  it("uses equal insets when the keyboard is closed", () => {
    const layout = getSearchDialogLayout({
      visualHeight: 800,
      offsetTop: 0,
      layoutHeight: 800,
    });

    expect(layout.keyboardOpen).toBe(false);
    expect(layout.top).toBe(SEARCH_DIALOG_BASE_INSET_PX);
    expect(layout.bottomInset).toBe(SEARCH_DIALOG_BASE_INSET_PX);
    expect(layout.contentPaddingBottom).toBe(0);
    expect(layout.maxHeight).toBe(800 - SEARCH_DIALOG_BASE_INSET_PX * 2);
  });

  it("adds bottom inset and content padding when the keyboard is open", () => {
    const layout = getSearchDialogLayout({
      visualHeight: 420,
      offsetTop: 0,
      layoutHeight: 800,
    });

    expect(layout.keyboardOpen).toBe(true);
    expect(layout.top).toBe(SEARCH_DIALOG_BASE_INSET_PX);
    expect(layout.bottomInset).toBe(SEARCH_DIALOG_KEYBOARD_BOTTOM_INSET_PX);
    expect(layout.contentPaddingBottom).toBe(
      SEARCH_DIALOG_KEYBOARD_CONTENT_PB_PX
    );
    expect(layout.maxHeight).toBe(
      420 - SEARCH_DIALOG_BASE_INSET_PX - SEARCH_DIALOG_KEYBOARD_BOTTOM_INSET_PX
    );
  });

  it("accounts for visualViewport offsetTop", () => {
    const layout = getSearchDialogLayout({
      visualHeight: 400,
      offsetTop: 48,
      layoutHeight: 800,
    });

    expect(layout.top).toBe(48 + SEARCH_DIALOG_BASE_INSET_PX);
  });
});
