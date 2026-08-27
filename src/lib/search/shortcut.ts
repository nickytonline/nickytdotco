export type SearchShortcut = {
  /** Visible chord for the modifier+K shortcut, e.g. "⌘K" or "Ctrl+K". */
  modifierChord: string;
};

/** Both modifier chords work; `/` is the additional opener. */
export const SEARCH_ARIA_KEYSHORTCUTS = "Meta+K Control+K /";

declare global {
  interface NavigatorUAData {
    readonly platform: string;
  }

  interface Navigator {
    readonly userAgentData?: NavigatorUAData;
  }
}

function isApplePlatform(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  const platform = navigator.userAgentData?.platform ?? navigator.platform;
  return /Mac|iPhone|iPad|iPod/i.test(platform);
}

export function getSearchShortcut(): SearchShortcut {
  return {
    modifierChord: isApplePlatform() ? "⌘K" : "Ctrl+K",
  };
}
