import request from '@/api/request'

// 地址信息
export function faveListApi(params) {
  return request({
    url: '/api/backend/fave/list',
    method: 'get',
    params
  })
}