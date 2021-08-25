import request from '@/api/request'

export function caseListApi(query) {
  return request({
    url: '/api/backend/case/list',
    method: 'get',
    params: query
  })
}

export function caseSaveApi(data) {
  return request({
    url: '/api/backend/case/save',
    method: 'POST',
    data
  })
}

export function caseDeleteApi(data) {
  return request({
    url: '/api/backend/case/delete',
    method: 'POST',
    data
  })
}

export function fetchCaseInfo(query) {
  return request({
    url: "/api/backend/case/detail/"+query.id,
    method: 'get',
  })
}