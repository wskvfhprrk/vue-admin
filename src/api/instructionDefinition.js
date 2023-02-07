import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/instructionDefinition/findPage',
    method: 'get',
    params: query
  })
}

export function createInstructionDefinition(data) {
  return request({
    url: '/instructionDefinition',
    method: 'post',
    data
  })
}

export function updateInstructionDefinition(data) {
  return request({
    url: '/instructionDefinition',
    method: 'put',
    data
  })
}

export function deleteInstructionDefinition(id) {
  return request({
    url: '/instructionDefinition/' + id,
    method: 'delete'
  })
}
