import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/sensorData/findPage',
    method: 'get',
    params: query
  })
}

export function createSensorData(data) {
  return request({
    url: '/sensorData',
    method: 'post',
    data
  })
}

export function updateSensorData(data) {
  return request({
    url: '/sensorData',
    method: 'put',
    data
  })
}

export function deleteSensorData(id) {
  return request({
    url: '/sensorData/' + id,
    method: 'delete'
  })
}
