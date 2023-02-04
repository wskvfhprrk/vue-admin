import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/commandStatus/findPage',
    method: 'get',
    params: query
  })
}

export function createCommandStatus(data) {
  return request({
    url: '/commandStatus',
    method: 'post',
    data
  })
}

export function updateCommandStatus(data) {
  return request({
    url: '/commandStatus',
    method: 'put',
    data
  })
}

export function deleteCommandStatus(id) {
  return request({
    url: '/commandStatus/' + id,
    method: 'delete'
  })
}
