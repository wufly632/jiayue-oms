import request from '@/api/request'

// 风格列表
export function productStyleApi(params) {
  return request({
    url: '/api/backend/product/style',
    method: 'get',
    params
  })
}

// 编辑
export function productStyleSaveApi(data) {
  return request({
    url: '/api/backend/product/style/save',
    method: 'POST',
    data
  })
}

// 上下架
export function productStyleOnofflineApi(data) {
  return request({
    url: '/api/product/style/onoffline',
    method: 'POST',
    data
  })
}

