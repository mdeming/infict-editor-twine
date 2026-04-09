/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_TWINE_FORK_EXTENDED?: string;
	readonly VITE_INFICT_TWINE?: string;
	readonly VITE_SNOWCONE_FORMAT_URL?: string;
	readonly VITE_SNOWCONE_FORMAT_BASE_URL?: string;
	readonly VITE_DIALOG_FORMS_ROOT?: string;
	readonly VITE_TWINE_EXTRA_BUILTINS?: string;
	readonly VITE_TWINE_MODULE_ALIASES?: string;
	readonly VITE_TWINE_REMOTE_QUERY_KEYS?: string;
	readonly VITE_TWINE_REMOTE_STORY_PATH_TEMPLATE?: string;
	readonly VITE_DEFAULT_FORMAT_NAME?: string;
	readonly VITE_DEFAULT_FORMAT_VERSION?: string;
}
