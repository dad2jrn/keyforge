export type RuntimeMode = 'development' | 'production' | 'test';

export interface AppConfig {
  readonly appName: string;
  readonly mode: RuntimeMode;
  readonly baseUrl: string;
  readonly isProduction: boolean;
  readonly repositoryBasePath: string;
}

const mode = import.meta.env.MODE as RuntimeMode;

export const appConfig: AppConfig = {
  appName: 'KeyForge Local',
  mode,
  baseUrl: import.meta.env.BASE_URL,
  isProduction: import.meta.env.PROD,
  repositoryBasePath: '/keyforge/',
};
