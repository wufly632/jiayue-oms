import request from '@/api/request'

// 订单 - 接口表
export function productStyleApi(params) {
  return request({
    url: '/api/backend/product/style',
    method: 'get',
    params
  })
}

// export function getAllCategory(query) {
//   return request({
//     url: '/api/category/all',
//     method: 'get',
//     params: query
//   })
// }

// export function getProductList(query) {
//   return request({
//     url: '/api/product/list',
//     method: 'get',
//     params: query
//   })
// }

// export function getAllAttributes() {
//   return request({
//     url: '/api/attribute/all',
//     method: 'get'
//   })
// }

// export function addAttribute(data) {
//   return request({
//     url: '/api/attribute/add',
//     method: 'POST',
//     data
//   })
// }

// export function addAttributeValue(data) {
//   return request({
//     url: '/api/attribute/value/add',
//     method: 'POST',
//     data
//   })
// }

// export function ProductSave(data) {
//   return request({
//     url: '/api/product/save',
//     method: 'POST',
//     data
//   })
// }

// export function fetchProductInfo(query) {
//   return request({
//     url: '/api/product/info',
//     method: 'get',
//     params: query
//   })
// }

// export function productExportApi(query) {
//   return request({
//     url: '/api/product/export',
//     method: 'get',
//     params: query
//   })
// }

// export function productOnOffLineApi(data) {
//   return request({
//     url: '/api/product/onOffLine',
//     method: 'POST',
//     data
//   })
// }