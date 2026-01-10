module.exports = {
  content: ["./src/**/*.{astro,html,js,ts,md,mdx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: "#173854",
        "primary-shade": "#102538",
        "primary-glare": "#22547c",
        highlight: "#fedb8b",
        light: "#ffffff",
        mid: "#cccccc",
        dark: "#333333",
        slate: "#404040",
      },
      spacing: {
        base: "1rem",
        100: "0.5rem",
        208: "52rem",
        300: "0.8rem",
        500: "1.25rem",
        600: "1.56rem",
        700: "1.95rem",
        800: "2.44rem",
        900: "3.05rem",
        max: "4rem",
      },
      fontFamily: {
        base: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        heading:
          "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
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
