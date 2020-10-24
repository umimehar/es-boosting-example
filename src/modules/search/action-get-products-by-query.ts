import { IAppRequest } from "../../types/app-request";
import { IAppResponse } from "../../types/app-response";
import { appConfig } from "../../config/env";
import { indexerName } from "../../config/es/post-mock-data-to-es";
import { BaseValidationType } from "../../types/validators";
import { body } from "express-validator";
import { reqValidationResult } from "../../config/middleware/req-validation-result";
import { transformEsSearchResultToData } from "../../config/middleware/transform-es-search-result-to-data";

const { Client } = require("@elastic/elasticsearch");

interface IReq extends IAppRequest {
  body: {
    query: string;
    page: number;
    size: number;
  };
}

export interface IRes extends IAppResponse {
  json: (body: {
    products: {
      name: string;
      brand: string;
      brand_boost: string;
    }[];
  }) => this;
}

export const actionGetProductsByQueryValidator: BaseValidationType = [
  body("query").exists().notEmpty(),
  body("size").optional(),
  body("page").optional(),
  reqValidationResult,
];

export async function actionGetProductsByQuery(
  req: IReq,
  res: IAppResponse
): Promise<IRes> {
  const {
    query,
    page = 1,
    size = 20,
  }: { query: string; page: number; size: number } = req.body;

  const offset: number = (page - 1) * size;

  // will sync type later
  const client: any = new Client({ node: appConfig.elasticSearchUrl });

  const esQuery: any = {
    query: {
      function_score: {
        query: {
          multi_match: {
            query,
            fields: ["name^5", "brand^3"],
          },
        },
        functions: [
          {
            field_value_factor: {
              field: "brand_boost",
            },
          },
        ],
        boost_mode: "multiply",
      },
    },
  };

  const esProductData: any[] = await client.search(
    {
      index: indexerName,
      body: esQuery,
      from: offset,
      size,
    },
    {
      ignore: [404],
      maxRetries: 3,
    }
  );

  return res.json(transformEsSearchResultToData(esProductData));
}
