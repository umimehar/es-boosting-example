import { appConfig } from "../env";
import { logger } from "../../util/logger";
const { Client } = require("@elastic/elasticsearch");

import productDoc = require("../../products.json");

export const indexerName: string = "example-products";

export async function postMockDataToEs(): Promise<void> {
  const client: any = new Client({ node: appConfig.elasticSearchUrl });
  const products: any[] = productDoc.products;

  try {
    // delete index if there is
    // create indexer
    await client.indices.delete(
      {
        index: indexerName,
      },
      { ignore: [400] }
    );
    // const { data } = await httpClient.httpDEL({ url: indexUrl });
  } catch (e) {
    if (e.statusCode == 404) {
      // indexer is not there. so ignore
    } else {
      logger.info("error deleting index");
    }
  }

  try {
    // create indexer
    await client.indices.create(
      {
        index: indexerName,
        body: {
          settings: {
            analysis: getElasticsEachFiltersAndAnalyzer(),
          },
          mappings: getProductProperties(),
        },
      },
      { ignore: [400] }
    );

    const body: any[] = products.flatMap((doc) => [
      { index: { _index: indexerName } },
      doc,
    ]);
    // put data
    const { body: responseFromPost } = await client.bulk({
      refresh: true,
      body,
    });
  } catch (e) {
    logger.error("Error connecting elastic search.");
    return;
  }
}

function getProductProperties(): any {
  return {
    properties: {
      name: {
        type: "text",
        analyzer: "myCustomAnalyzer",
        boost: 10,
      },
      brand: {
        type: "text",
        analyzer: "myCustomAnalyzer",
        boost: 10,
      },
      // more properties.
    },
  };
}

function getElasticsEachFiltersAndAnalyzer(): any {
  return {
    filter: {
      english_stop: {
        type: "stop",
        stopwords: "_english_",
      },
      english_keywords: {
        type: "keyword_marker",
        keywords: ["example"],
      },
      english_stemmer: {
        type: "stemmer",
        language: "english",
      },
      english_possessive_stemmer: {
        type: "stemmer",
        language: "possessive_english",
      },
      my_ngram_filter: {
        type: "edgeNGram",
        min_gram: 3, // we can customize this as much as we want.
        max_gram: 10,
      },
    },
    analyzer: {
      myCustomAnalyzer: {
        tokenizer: "standard",
        filter: [
          "lowercase",
          "english_possessive_stemmer",
          "english_stop",
          "english_keywords",
          "my_ngram_filter",
        ],
      },
    },
  };
}
