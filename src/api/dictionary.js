import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/dictionary/findPage',
    method: 'get',
    params: query
  })
}

export function createDictionary(data) {
  return request({
    url: '/dictionary',
    method: 'post',
    data
  })
}

export function updateDictionary(data) {
  return request({
    url: '/dictionary',
    method: 'put',
    data
  })
}

export function deleteDictionary(id) {
  return request({
    url: '/dictionary/' + id,
    method: 'delete'
  })
}
