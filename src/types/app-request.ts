import { Request } from "express-serve-static-core";
import { IncomingHttpHeaders } from "http";

interface IBaseAppHeaders extends IncomingHttpHeaders {
  // https://support.cloudflare.com/hc/en-us/articles/200168236-Configuring-Cloudflare-IP-Geolocation
}

export type AppNameType = "web-www";

interface IBaseAppRequest extends Request {
  headers: IBaseAppHeaders;
  appName?: string;
}

export interface IAppHeaders extends IBaseAppHeaders {}

export interface IAppRequest extends IBaseAppRequest {
  headers: IAppHeaders;
}
