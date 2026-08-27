export type SearchShortcut = {
  /** Visible chord for the modifier+K shortcut, e.g. "⌘K" or "Ctrl+K". */
  modifierChord: string;
  /** Space-separated `aria-keyshortcuts` value for the search control. */
  ariaKeyShortcuts: string;
};

function isApplePlatform(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  const userAgentData = (
    navigator as Navigator & {
      userAgentData?: { platform?: string };
    }
  ).userAgentData;
  const platform = userAgentData?.platform ?? navigator.platform;

  return /Mac|iPhone|iPad|iPod/i.test(platform);
}

export function getSearchShortcut(): SearchShortcut {
  const isApple = isApplePlatform();

  return {
    modifierChord: isApple ? "⌘K" : "Ctrl+K",
    ariaKeyShortcuts: isApple ? "Meta+K /" : "Control+K /",
  };
}
