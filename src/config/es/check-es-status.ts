import { appConfig } from "../env";
import { httpClient } from "../../util/http-client";
import { logger } from "../../util/logger";

export async function checkEsIsActive(): Promise<void> {
  const elasticsearchUrl: string = appConfig.elasticSearchUrl;

  if (!elasticsearchUrl) {
    logger.error(
      "Elastic search URL not found, please put in src/config/env/index.ts"
    );
    return;
  }
  try {
    const { data } = await httpClient.httpGET({
      url: `${elasticsearchUrl}/_cluster/health`,
    });
    // elastic search is active
  } catch (e) {
    logger.error("Error connecting elastic search.");
    return;
  }
}
