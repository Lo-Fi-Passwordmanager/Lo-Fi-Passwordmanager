/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DEFAULT_SYNC_SERVER_NAME: string;
    readonly VITE_DEFAULT_SYNC_SERVER_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}