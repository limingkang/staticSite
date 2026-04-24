import request from '@/utils/fetch'

export function getUserList(params = {}, config = {}) {
  return request({
    url: '/users',
    method: 'get',
    params,
    ...config,
  })
}

export function getUserDetail(id) {
  return request({
    url: `/users/${id}`,
    method: 'get',
  })
}

export function updateUser(id, data) {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data,
  })
}
