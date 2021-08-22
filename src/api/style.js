import request from '@/api/request'

// 订单 - 接口表
export function productStyleApi(params) {
  return request({
    url: '/api/backend/product/style',
    method: 'get',
    params
  })
}