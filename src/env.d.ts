/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    netlify: {
      context: import("@netlify/functions").Context;
    };
  }
}
