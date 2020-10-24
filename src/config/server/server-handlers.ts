import { Address } from "cluster";

import { logger } from "../../util/logger";
import { appConfig } from "../env";

export function onError(
  error: NodeJS.ErrnoException,
  port: number | string | boolean
): void {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind: string =
    typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case "EACCES":
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);

      break;
    case "EADDRINUSE":
      logger.error(`${bind} is already in use`);
      process.exit(1);

      break;
    default:
      throw error;
  }
}

export async function onListening(this: unknown | any): Promise<void> {
  const addr: Address = this.address();
  const bind: string =
    typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;

  logger.info(`Listening on ${bind}`);
}

export function onUnhandledRejection(
  reason: Error | any,
  promise: Promise<any>
): void {
  // todo sentry
  logger.error(
    `Unhandled Rejection at:${JSON.stringify(promise)} reason: ${JSON.stringify(
      reason
    )}`
  );
}

export function onUncaughtException(err: Error, origin: string): void {
  // todo sentry
  logger.error(
    `Unhandled Exception at: ${JSON.stringify(err)} origin: ${JSON.stringify(
      origin
    )}`
  );
}
