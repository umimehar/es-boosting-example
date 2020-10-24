import { Router } from "express";
import { Router as IRouter } from "express-serve-static-core";
import { catchAsyncErrors } from "../../util/router";
import {
  actionGetProductsByQuery,
  actionGetProductsByQueryValidator,
} from "./action-get-products-by-query";

const routes: IRouter = Router();

routes.post(
  "/v1-get-products-by-query",
  actionGetProductsByQueryValidator,
  catchAsyncErrors(actionGetProductsByQuery)
);

export { routes as searchRoutes };
