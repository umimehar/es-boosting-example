import map from "lodash/map";

export function transformEsSearchResultToData(
  data: any // es search resp
): { list: any[]; meta: { total: number } } {
  return {
    list: map(data?.body?.hits?.hits, "_source"),
    meta: { total: data?.body?.hits?.total?.value },
  };
}
