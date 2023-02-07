import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/dtuInfo/findPage',
    method: 'get',
    params: query
  })
}

export function createDtuInfo(data) {
  return request({
    url: '/dtuInfo',
    method: 'post',
    data
  })
}

export function updateDtuInfo(data) {
  return request({
    url: '/dtuInfo',
    method: 'put',
    data
  })
}

export function deleteDtuInfo(id) {
  return request({
    url: '/dtuInfo/' + id,
    method: 'delete'
  })
}
