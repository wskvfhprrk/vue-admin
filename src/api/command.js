import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/command/findPage',
    method: 'get',
    params: query
  })
}

export function createCommand(data) {
  return request({
    url: '/command',
    method: 'post',
    data
  })
}

export function updateCommand(data) {
  return request({
    url: '/command',
    method: 'put',
    data
  })
}

export function deleteCommand(id) {
  return request({
    url: '/command/' + id,
    method: 'delete'
  })
}
