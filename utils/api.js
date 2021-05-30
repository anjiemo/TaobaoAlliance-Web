import request from './http';

export const baseUrl = "https://api.sunofbeach.net/shop/";

const SUCCESS_CODE = 10000;
const DEFAULT_CODE = 200;

export default {
  SUCCESS_CODE,
  DEFAULT_CODE,
  getCategories() {
    return request.requestGet(baseUrl + "discovery/categories");
  },
  getCategoriesByProxy() {
    return request.requestGet("/union/discovery/categories");
  },
  getCategoryContent(materialId, page) {
    return request.requestGet(baseUrl + "discovery/" + materialId + "/" + page);
  },
  getCategoryContentByProxy(materialId, page) {
    return request.requestGet("/union/discovery/" + materialId + "/" + page);
  },
  getRecommendCategories() {
    return request.requestGet(baseUrl + "recommend/categories");
  },
  getRecommendContent(categoryId) {
    return request.requestGet(baseUrl + "recommend/" + categoryId);
  },
  getOnSellContent(page) {
    return request.requestGet(baseUrl + "onSell/" + page);
  },
  getOnSellContentByProxy(page) {
    return request.requestGet("union/onSell/" + page);
  },
  getRecommendContentByProxy(categoryId) {
    return request.requestGet("union/recommend/" + categoryId);
  },
  doSearch(keyword, page) {
    return request.requestGet(baseUrl + "search?page=" + page + "&keyword=" + keyword);
  },
  doSearchByProxy(keyword, page) {
    return request.requestGet("union/search?page=" + page + "&keyword=" + keyword);
  }
}
