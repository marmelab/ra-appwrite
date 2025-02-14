interface ImportMetaEnv {
    VITE_APPWRITE_ENDPOINT: string;
    VITE_APPWRITE_PROJECTID: string;
    VITE_APPWRITE_DATABASEID: string;
    VITE_APPWRITE_COLLECTIONIDS: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
