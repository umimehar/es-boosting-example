import "dotenv/config";

export type ConfigMapType = {
  [name: string]: () => IConfig;
};

// server runtime environment, configurable on development server as dev and production environment as prod
// use case example:
// when user register on development environment, we don't have access to sms or email
// or in automation environment we need to get the verification code in registration
export const isRunTimeDev: boolean = process.env.RUNTIME_ENV !== "prod";

export interface IConfig {
  name: string;
  port: number;
  secret: string;
  isLocal?: boolean;
  httpTimeout: number;
  isProduction?: boolean;
  isDevelopment?: boolean;
  isTesting?: boolean;
  routePathPrefix: string;
  elasticSearchUrl: string;
}

const nodeEnv: string = process.env.NODE_ENV ?? "development";
const appName: string = process.env.APP_NAME ?? "es";

const development: any = (): IConfig => {
  return {
    isLocal: false,
    isTesting: false,
    isDevelopment: nodeEnv === "development",
    isProduction: nodeEnv === "production",
    name: appName,
    routePathPrefix: process.env.ROUTE_PATH_PREFIX ?? "/api/es/",
    port: parseInt(process.env.PORT || "0") ?? 0,
    secret: process.env.SECRET ?? "@QEGTUI",
    httpTimeout: parseInt(process.env.HTTP_CLIENT_TIMEOUT) ?? 10000,
    elasticSearchUrl: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
  };
};

const production: any = (): IConfig => {
  return {
    isTesting: false,
    isLocal: false,
    isDevelopment: nodeEnv === "development",
    isProduction: nodeEnv === "production",
    name: appName,
    routePathPrefix: process.env.ROUTE_PATH_PREFIX ?? "/api/es/",
    port: parseInt(process.env.PORT || "0") ?? 0,
    secret: process.env.SECRET ?? "@QEGTUI",
    httpTimeout: parseInt(process.env.HTTP_CLIENT_TIMEOUT) ?? 10000,
    elasticSearchUrl: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
  };
};

const test: any = (): IConfig => {
  return {
    isTesting: true,
    isLocal: false,
    isDevelopment: nodeEnv === "development",
    isProduction: nodeEnv === "production",
    name: appName,
    routePathPrefix: process.env.ROUTE_PATH_PREFIX ?? "/api/es/",
    port: parseInt(process.env.PORT || "0") ?? 0,
    secret: process.env.SECRET ?? "@QEGTUI",
    httpTimeout: parseInt(process.env.HTTP_CLIENT_TIMEOUT) ?? 10000,
    elasticSearchUrl: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
  };
};

const configMap: ConfigMapType = {
  test,
  development,
  production,
};

export const appConfig: IConfig = configMap[nodeEnv]();

const appNamePortSum: any = (): number => {
  return (
    Math.ceil(
      [...Buffer.from(appConfig.name).toString("base64")].reduce(
        (sum: any, char: any): number => sum + char.charCodeAt(0),
        0
      ) / 30
    ) + 3000
  );
};

// tslint:disable-next-line:no-typeof-undefined
appConfig.port =
  typeof process.env.PORT == "undefined" ? appNamePortSum() : appConfig.port;
