import os from "os";
import { Response } from "express-serve-static-core";

import { appConfig } from "../../config/env";
import { IAppRequest } from "../../types/app-request";
import { IAppResponse } from "../../types/app-response";
import { httpClient } from "../../util/http-client";

const podFullName: string =
  [process.env.K8S_POD_NAME, process.env.K8S_POD_IP, process.env.K8S_NODE_NAME]
    .filter((e) => e)
    .join("_") || appConfig.name;
const sigState: Record<string, any> = { sigTerm: false, sgiKill: false };

process.on("SIGTERM", function onSigterm() {
  sigState.sigTerm = true;
  sigState.sigTermTime = Date().toString();
});

process.on("SIGILL", function onSigterm() {
  sigState.sgiKill = true;
  sigState.sgiKillTime = Date().toString();
});

export async function getHealthz(
  req: IAppRequest,
  res: IAppResponse
): Promise<any> {
  return res.json({ success: true, podFullName, sigState });
}

export async function getStats(
  req: IAppRequest,
  res: IAppResponse
): Promise<any> {
  const { secret } = req.query;

  const basicHealthSecret: string =
    process.env.BASIC_STATS_SECRET_CONFIG || "health-secret";

  // tslint:disable-next-line:insecure-random
  const extraHealthSecret: string =
    process.env.EXTRA_STATS_SECRET_CONFIG || Math.random().toString();

  // todo fix this later
  // tslint:disable-next-line:possible-timing-attack
  if (secret !== basicHealthSecret && secret !== extraHealthSecret) {
    return res.status(401).json({});
  }
  const jsObject: any = {
    pid: process.pid,
    // redact secrets
    // cpu: os.cpus(),

    headers: req.headers,
    freeMem: os.freemem(),
    totalMem: os.totalmem(),
  };

  let extraObject: any = {};

  // tslint:disable-next-line:possible-timing-attack
  if (secret === extraHealthSecret) {
    extraObject = {
      config: appConfig,
      env: process.env,
    };
  }

  res.json({ ...jsObject, ...extraObject, podFullName, sigState });
}

export async function getElasticsearchHealth(
  req: IAppRequest,
  res: IAppResponse
): Promise<Response> {
  const { secret } = req.query;

  const basicHealthSecret: string =
    process.env.BASIC_STATS_SECRET_CONFIG || "health-secret";

  // tslint:disable-next-line:possible-timing-attack
  if (secret !== basicHealthSecret) {
    return res.status(401).json({});
  }

  const elasticsearchUrl: string = appConfig.elasticSearchUrl;

  if (!elasticsearchUrl) {
    return res.status(400).json({ message: "Missing `ELASTICSEARCH_URL`" });
  }
  let esData: any;
  try {
    const { data } = await httpClient.httpGET({
      url: `${elasticsearchUrl}/_cluster/health`,
    });
    esData = data;
  } catch (e) {
    console.log(e);
  }

  return res.json({ ...esData, podFullName, sigState });
}
