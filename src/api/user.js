import request from '@/api/request'

// 用户 - 接口表
export function loginApi(data) {
  return request({
    url: '/api/backend/login',
    method: 'post',
    data
  })
}

// export function roleDetailApi() {
//   return request({
//     url: '/api/role/detail',
//     method: 'get'
//   })
// }

export function logoutApi() {
  return request({
    url: '/api/user/logout',
    method: 'post'
  })
}
