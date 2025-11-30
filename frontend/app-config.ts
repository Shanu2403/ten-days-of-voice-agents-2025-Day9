export interface AppConfig {
  pageTitle: string;
  pageDescription: string;
  companyName: string;

  supportsChatInput: boolean;
  supportsVideoInput: boolean;
  supportsScreenShare: boolean;
  isPreConnectBufferEnabled: boolean;

  logo: string;
  startButtonText: string;
  accent?: string;
  logoDark?: string;
  accentDark?: string;

  // for LiveKit Cloud Sandbox
  sandboxId?: string;
  agentName?: string;
}

export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: 'Blinkit',
  pageTitle: 'Blinkit Voice (NOVA)',
  pageDescription: 'Your quantum shopping assistant for groceries in 10 minutes.',

  supportsChatInput: true,
  supportsVideoInput: false,
  supportsScreenShare: false,
  isPreConnectBufferEnabled: true,

  logo: '/logo.svg',
  startButtonText: 'START ORDERING',
  accent: '#0C831F', // Blinkit Green
  logoDark: '/logo.svg',
  accentDark: '#0C831F', // Blinkit Green

  // for LiveKit Cloud Sandbox
  sandboxId: undefined,
  agentName: 'blinkit-agent',
};
