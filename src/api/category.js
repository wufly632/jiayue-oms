import request from '@/api/request'

// 类别列表
export function productTypesApi(params) {
  return request({
    url: '/api/backend/product/types',
    method: 'get',
    params
  })
}

// 编辑 / 修改
export function productTypesSaveApi(data) {
  return request({
    url: '/api/product/types/save',
    method: 'POST',
    data
  })
}

// 上下架
export function productTypesOnofflineApi(data) {
  return request({
    url: '/api/product/types/onoffline',
    method: 'POST',
    data
  })
}

