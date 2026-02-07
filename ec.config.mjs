import { defineEcConfig } from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

export default defineEcConfig({
  plugins: [pluginLineNumbers()],
  themes: ["github-light", "github-dark"],
  useDarkModeMediaQuery: false,
  themeCssSelector: (theme) => {
    return theme.name === "github-dark" ? ".dark" : ":root:not(.dark)";
  },
  defaultProps: {
    wrap: true,
    preserveIndent: true,
    showLineNumbers: true,
  },
  styleOverrides: {
    borderRadius: "0",
    borderWidth: "2px",
    borderColor: "rgb(55 65 81)", // gray-700
    codePaddingBlock: "1rem",
    codePaddingInline: "1.5rem",
    frames: {
      shadowColor: "transparent",
    },
    uiFontFamily:
      '"Geist Mono", ui-monospace, SFMono-Regular, "SF Mono", Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Courier New", monospace',
    codeFontFamily:
      '"Geist Pixel", ui-monospace, SFMono-Regular, "SF Mono", Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Courier New", monospace',
  },
});
