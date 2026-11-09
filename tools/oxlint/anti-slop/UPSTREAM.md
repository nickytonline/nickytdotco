# Vendored anti-slop Oxlint rules

Source: [dmmulroy/anti-slop](https://github.com/dmmulroy/anti-slop), revision
`13909c9e07590f5a85d93c62712259fe14a883f7` (retrieved 2026-11-08).

The generic plugin source is copied from upstream `src/`. Effect-specific rules
are not included because this repository does not use Effect. The plugin is
registered in `vite.config.ts`, and all generic rules documented by upstream are
enabled as errors for application code. E2E files retain their original
contents; readable-spacing and assertion-comment rules are disabled for that
test directory. `@oxlint/plugins` is pinned to the same version as Oxlint.

The upstream MIT license is in `LICENSE`. The readable-spacing rule also
contains ESLint Stylistic code; its license and provenance are retained in
`vendor/eslint-stylistic/`.
