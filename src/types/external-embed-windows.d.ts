export {};

declare global {
  interface Window {
    __CPEmbed?: () => void;
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}
