import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/relayDefinitionCommand/findPage',
    method: 'get',
    params: query
  })
}

export function createRelayDefinitionCommand(data) {
  return request({
    url: '/relayDefinitionCommand',
    method: 'post',
    data
  })
}

export function updateRelayDefinitionCommand(data) {
  return request({
    url: '/relayDefinitionCommand',
    method: 'put',
    data
  })
}

export function deleteRelayDefinitionCommand(id) {
  return request({
    url: '/relayDefinitionCommand/' + id,
    method: 'delete'
  })
}
