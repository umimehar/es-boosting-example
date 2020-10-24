import express from "express";
import { Application } from "express-serve-static-core";

import { appConfig } from "../env";
import { initRouter } from "../../routes";
import {
  configureMiddleware,
  initErrorHandler,
} from "../middleware/middleware";

/**
 * @constant {Application}
 */
const app: Application = express();

// Serve assets from the disk path
if (appConfig.isDevelopment) {
  app.use(express.static(`/tmp/${appConfig.name}`));
}

/**
 * @constructs Application Middleware
 */
configureMiddleware(app);

/**
 * @constructs Application Routes
 */
initRouter(app);

/**
 * @constructs Application Error Handler
 */
initErrorHandler(app);

/**
 * @exports {Application}
 */
export { app };
