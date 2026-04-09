/**
 * Snowcone **passage command editor**: structured editing of request/response JSON inside
 * the passage edit dialog, backed by the `@infict/dialog-forms` package (Vite alias
 * `@twine-fork/dialog-forms`). Twine UI names this feature “passage command editor”; the
 * npm package and its exports (`DialogFormFactory`, `DialogFormsAPI`, etc.) keep their
 * historical names.
 *
 * Resolution:
 * - **Vite / Jest**: [`vite.config.mts`](../vite.config.mts) `resolveSnowconeDialogFormsAliases()` —
 *   maps module ids to `VITE_DIALOG_FORMS_ROOT`, else `node_modules/@infict/dialog-forms` if present,
 *   else `../snowcone/dialog-forms-dist/dialog-forms` (sibling Snowcone checkout).
 */

/** TypeScript / bundler import path (fork alias → package on disk). */
export const SNOWCONE_DIALOG_FORMS_MODULE_ID = '@twine-fork/dialog-forms' as const;

/** Published package name in `package.json` (`dependencies` / `devDependencies`). */
export const SNOWCONE_DIALOG_FORMS_NPM_PACKAGE = '@infict/dialog-forms' as const;

/** Primary `window` key for the dialog-forms module (Snowcone format hydrate + Twine dev). */
export const WINDOW_PASSAGE_COMMAND_FORMS_MODULE = '__twinePassageCommandForms' as const;

/** Legacy keys still set by Snowcone `format.js` hydrate (read after primary). */
export const WINDOW_LEGACY_TWINE_DIALOG_FORMS = '__twineDialogForms' as const;
export const WINDOW_LEGACY_INFICT_DIALOG_FORMS = '__infictDialogForms' as const;
