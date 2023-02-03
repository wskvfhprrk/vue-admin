import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/checkingRules/page',
    method: 'get',
    params: query
  })
}

export function automaticAdjustment(id) {
  return request({
    url: '/checkingRules/automaticAdjustment/' + id,
    method: 'get'
  })
}

// export function fetchPv(pv) {
//   return request({
//     url: '/checkingRules/pv',
//     method: 'get',
//     params: { pv }
//   })
// }

export function createCheckingRules(data) {
  return request({
    url: '/checkingRules',
    method: 'post',
    data
  })
}

export function updateCheckingRules(data) {
  return request({
    url: '/checkingRules',
    method: 'put',
    data
  })
}

export function deleteCheckingRules(id) {
  return request({
    url: '/checkingRules/' + id,
    method: 'delete'
  })
}
