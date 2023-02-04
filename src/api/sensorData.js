import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/densorDataDb/findPage',
    method: 'get',
    params: query
  })
}

export function createSensorData(data) {
  return request({
    url: '/densorDataDb',
    method: 'post',
    data
  })
}

export function updateSensorData(data) {
  return request({
    url: '/densorDataDb',
    method: 'put',
    data
  })
}

export function deleteSensorData(id) {
  return request({
    url: '/densorDataDb/' + id,
    method: 'delete'
  })
}
