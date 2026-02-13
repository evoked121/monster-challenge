type RuntimeEnv = {
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID: string;
  CHALLENGE_TOKEN: string;
};

export const runtimeEnv = (((window as unknown as { __env?: Partial<RuntimeEnv> }).__env ?? {}) as RuntimeEnv);
