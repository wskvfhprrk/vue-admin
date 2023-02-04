import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/relay/findPage',
    method: 'get',
    params: query
  })
}

export function createRelay(data) {
  return request({
    url: '/relay',
    method: 'post',
    data
  })
}

export function updateRelay(data) {
  return request({
    url: '/relay',
    method: 'put',
    data
  })
}

export function deleteRelay(id) {
  return request({
    url: '/relay/' + id,
    method: 'delete'
  })
}
