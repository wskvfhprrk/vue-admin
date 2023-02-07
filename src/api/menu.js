import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/menu/findPage',
    method: 'get',
    params: query
  })
}

export function createMenu(data) {
  return request({
    url: '/menu',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: '/menu',
    method: 'put',
    data
  })
}

export function deleteMenu(id) {
  return request({
    url: '/menu/' + id,
    method: 'delete'
  })
}
