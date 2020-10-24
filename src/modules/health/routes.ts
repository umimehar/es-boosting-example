import { Router } from "express";
import { Router as IRouter } from "express-serve-static-core";

import { catchAsyncErrors } from "../../util/router";
import { getElasticsearchHealth, getStats, getHealthz } from "./ctrl";

const routes: IRouter = Router();

routes.get("/v1-healthz", catchAsyncErrors(getHealthz));
routes.get("/v1-stats", catchAsyncErrors(getStats));
routes.get(
  "/v1-elasticsearch-health",
  catchAsyncErrors(getElasticsearchHealth)
);

export { routes as healthRoutes };
