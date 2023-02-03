import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/dtuInfo/page',
    method: 'get',
    params: query
  })
}

export function fetchDtuInfo(id) {
  return request({
    url: '/dtuInfo/detail',
    method: 'get',
    params: { id }
  })
}

// export function fetchPv(pv) {
//   return request({
//     url: '/dtuInfo/pv',
//     method: 'get',
//     params: { pv }
//   })
// }

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
