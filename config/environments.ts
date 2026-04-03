// Typed environment configuration
// In Java this would be: ConfigFactory / Owner library / @Value annotations

// Define what an environment looks like — like a Java interface or record
export interface Environment {
  baseUrl: string;
  apiUrl: string;
  timeouts: {
    navigation: number;
    action: number;
  };
}

// All known environments — like application-dev.properties, application-stage.properties
const environments: Record<string, Environment> = {
  dev: {
    baseUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:3001/api',
    timeouts: { navigation: 30_000, action: 10_000 },
  },
  stage: {
    baseUrl: 'https://the-internet.herokuapp.com',
    apiUrl: 'https://the-internet.herokuapp.com/api',
    timeouts: { navigation: 60_000, action: 15_000 },
  },
  prod: {
    baseUrl: 'https://the-internet.herokuapp.com',
    apiUrl: 'https://the-internet.herokuapp.com/api',
    timeouts: { navigation: 60_000, action: 15_000 },
  },
};

// Resolve active environment from ENV variable, default to 'stage'
// Usage: ENV=prod npx playwright test
const activeEnv = process.env.ENV ?? 'stage';

if (!(activeEnv in environments)) {
  throw new Error(
    `Unknown environment: "${activeEnv}". Valid options: ${Object.keys(environments).join(', ')}`
  );
}

// Export the resolved config — consumers don't need to know about ENV variable
export const config: Environment = environments[activeEnv]!;
