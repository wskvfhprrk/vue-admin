import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/checkingRules/findPage',
    method: 'get',
    params: query
  })
}

export function createCheckingRules(data) {
  return request({
    url: '/checkingRules',
    method: 'post',
    data
  })
}

export function updateCheckingRules(data) {
  return request({
    url: '/checkingRules',
    method: 'put',
    data
  })
}

export function deleteCheckingRules(id) {
  return request({
    url: '/checkingRules/' + id,
    method: 'delete'
  })
}
