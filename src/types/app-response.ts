import { Response } from "express-serve-static-core";
import { HttpError } from "./http-error";

interface IBaseAppResponse extends Response {}

// error middleware formatter
interface IBaseAppResponse {
  sendHttpError: (error: HttpError | Error, message?: string) => void;
}

// error middleware formatter
export interface IAppResponse extends IBaseAppResponse {}
