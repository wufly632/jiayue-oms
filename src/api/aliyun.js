import request from '@/api/request'

export function aliyunPolicy(data) {
  return request({
    url: '/api/aliyun/policy',
    method: 'post',
    data
  })
}
