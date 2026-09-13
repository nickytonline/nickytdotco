/** Base inset from the visual viewport edges when the keyboard is closed. */
export const SEARCH_DIALOG_BASE_INSET_PX = 12;

/** Extra bottom inset while the software keyboard (or shrunk visual viewport) is open. */
export const SEARCH_DIALOG_KEYBOARD_BOTTOM_INSET_PX = 32;

/** Extra content padding-bottom while the keyboard is open. */
export const SEARCH_DIALOG_KEYBOARD_CONTENT_PB_PX = 32;

/** Treat the keyboard as open once the visual viewport is this much shorter. */
export const SEARCH_DIALOG_KEYBOARD_THRESHOLD_PX = 100;

export const SEARCH_DIALOG_MAX_HEIGHT_PX = 36 * 16;

export type SearchDialogLayout = {
  top: number;
  height: number;
  maxHeight: number;
  bottomInset: number;
  contentPaddingBottom: number;
  keyboardOpen: boolean;
};

/**
 * Position the search dialog inside the visual viewport, with extra bottom
 * breathing room when a mobile keyboard shrinks the visible area.
 */
export function getSearchDialogLayout({
  visualHeight,
  offsetTop,
  layoutHeight,
}: {
  visualHeight: number;
  offsetTop: number;
  layoutHeight: number;
}): SearchDialogLayout {
  const keyboardOpen =
    layoutHeight - visualHeight > SEARCH_DIALOG_KEYBOARD_THRESHOLD_PX;
  const topInset = SEARCH_DIALOG_BASE_INSET_PX;
  const bottomInset = keyboardOpen
    ? SEARCH_DIALOG_KEYBOARD_BOTTOM_INSET_PX
    : SEARCH_DIALOG_BASE_INSET_PX;
  const available = Math.max(0, visualHeight - topInset - bottomInset);

  return {
    top: offsetTop + topInset,
    height: Math.min(available, SEARCH_DIALOG_MAX_HEIGHT_PX),
    maxHeight: available,
    bottomInset,
    contentPaddingBottom: keyboardOpen
      ? SEARCH_DIALOG_KEYBOARD_CONTENT_PB_PX
      : 0,
    keyboardOpen,
  };
}
