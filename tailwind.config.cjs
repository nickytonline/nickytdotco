const tokens = require("./src/_data/tokens.json");

const stripOuterQuotes = (value) => value.replace(/^"|"$/g, "");

module.exports = {
  content: ["./src/**/*.{astro,html,js,ts,md,mdx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: tokens.colors,
      spacing: {
        ...tokens["size-scale"],
      },
      fontFamily: {
        base: stripOuterQuotes(tokens.fonts.base),
        sans: stripOuterQuotes(tokens.fonts["sans-serif"]),
      },
      fontSize: {
        100: "0.5rem",
        300: "0.8rem",
        500: "1.25rem",
        600: "1.56rem",
        700: "1.95rem",
        800: "2.44rem",
        900: "3.05rem",
        base: "1rem",
        max: "4rem",
      },
      lineHeight: {
        tight: "1.2",
        mid: "1.5",
        loose: "1.7",
      },
      zIndex: {
        300: "0",
        400: "10",
        500: "20",
        600: "30",
        700: "40",
      },
    },
  },
};
