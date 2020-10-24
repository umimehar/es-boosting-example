import map from 'lodash/map';

export function transformEsSearchResultToData(resp: any): any {
    return { list: map(resp?.body?.hits?.hits, '_source'), meta: { total: resp?.body?.hits?.total?.value } };
}
