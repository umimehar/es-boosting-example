# es-boosting-example

To run the example
`yarn install`, and then `yarn dev`

Make sure elastic search is running on localhost:9200, you can change this config in [src/config/env.index](https://github.com/umimehar/es-boosting-example/blob/master/src/config/env/index.ts ).

### Elastic Search Related files

**Delete/Create/Post index**
 - [src/config/es/post-mock-data-to-es.ts](https://github.com/umimehar/es-boosting-example/blob/master/src/config/es/post-mock-data-to-es.ts "post-mock-data-to-es.ts")
 -  [src/config/es/check-es-status.ts](https://github.com/umimehar/es-boosting-example/blob/master/src/config/es/check-es-status.ts "check-es-status.ts")
 
 **Search from Index**
 
 - [src/modules/search/action-get-products-by-query.ts](https://github.com/umimehar/es-boosting-example/blob/master/src/modules/search/action-get-products-by-query.ts "action-get-products-by-query.ts")
 


### Postman Api Documentation
> https://documenter.getpostman.com/view/9438847/TVYF7xrq
