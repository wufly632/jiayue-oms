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

export function productListApi(query) {
  return request({
    url: '/api/backend/product/list',
    method: 'get',
    params: query
  })
}

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

export function productSaveApi(data) {
  return request({
    url: '/api/backend/product/save',
    method: 'POST',
    data
  })
}

export function productDeleteApi(data) {
  return request({
    url: '/api/backend/product/delete',
    method: 'POST',
    data
  })
}

export function fetchProductInfo(query) {
  return request({
    url: "/api/backend/product/detail/"+query.id,
    method: 'get',
  })
}

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