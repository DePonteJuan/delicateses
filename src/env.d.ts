/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_WHATSAPP_NUMBER: string;
  readonly PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER?: string;
  readonly PUBLIC_KEYSTATIC_GITHUB_REPO_NAME?: string;
  readonly PUBLIC_KEYSTATIC_GITHUB_APP_SLUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
