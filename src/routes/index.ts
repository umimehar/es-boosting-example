import http from "http";
import { NOT_FOUND } from "http-status-codes";
import { Application, NextFunction } from "express-serve-static-core";

import { IAppRequest } from "../types/app-request";

import { IAppResponse } from "../types/app-response";
import { healthRoutes } from "../modules/health/routes";
import { searchRoutes } from "../modules/search/routes";

export function initRouter(app: Application): void {
  app.use("/", healthRoutes);
  app.use("/", searchRoutes);

  // Register no route found
  app.use(
    (req: IAppRequest, res: IAppResponse, next: NextFunction): IAppResponse => {
      return res.status(NOT_FOUND).json({
        code: NOT_FOUND,
        message: http.STATUS_CODES[NOT_FOUND],
      });
    }
  );
}
