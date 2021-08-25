import request from '@/api/request'

// 地址信息
export function addressDetailApi(params) {
  return request({
    url: '/api/backend/address/info',
    method: 'get',
    params
  })
}

// 保存地址信息
export function addressSaveApi(data) {
  return request({
    url: '/api/backend/address/save',
    method: 'POST',
    data
  })
}


// 关于我们信息
export function aboutDetailApi(params) {
    return request({
      url: '/api/backend/about/info',
      method: 'get',
      params
    })
  }
  
  // 保存关于我们信息
  export function aboutSaveApi(data) {
    return request({
      url: '/api/backend/about/save',
      method: 'POST',
      data
    })
  }


  // 联系我们信息
export function contactDetailApi(params) {
    return request({
      url: '/api/backend/contact/info',
      method: 'get',
      params
    })
  }
  
  // 保存联系我们信息
  export function contactSaveApi(data) {
    return request({
      url: '/api/backend/contact/save',
      method: 'POST',
      data
    })
  }