import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/sensor/findPage',
    method: 'get',
    params: query
  })
}

export function createSensor(data) {
  return request({
    url: '/sensor',
    method: 'post',
    data
  })
}

export function updateSensor(data) {
  return request({
    url: '/sensor',
    method: 'put',
    data
  })
}

export function deleteSensor(id) {
  return request({
    url: '/sensor/' + id,
    method: 'delete'
  })
}
