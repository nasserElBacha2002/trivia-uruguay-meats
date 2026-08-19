/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface TriviaDesktopApi {
  readonly isDesktop: true;
  onOpenAdmin: (callback: () => void) => () => void;
}

interface Window {
  triviaDesktop?: TriviaDesktopApi;
}
