import request from '@/utils/fetch'

export function getRoleList(params = {}, config = {}) {
  return request({
    url: '/roles',
    method: 'get',
    params,
    ...config,
  })
}

export function getRoleDetail(id, config = {}) {
  return request({
    url: `/roles/${id}`,
    method: 'get',
    ...config,
  })
}

export function createRole(data, config = {}) {
  return request({
    url: '/roles',
    method: 'post',
    data,
    ...config,
  })
}

export function updateRole(id, data, config = {}) {
  return request({
    url: `/roles/${id}`,
    method: 'put',
    data,
    ...config,
  })
}

export function deleteRole(id, config = {}) {
  return request({
    url: `/roles/${id}`,
    method: 'delete',
    ...config,
  })
}

export function batchDeleteRoles(data, config = {}) {
  return request({
    url: '/roles/batch-delete',
    method: 'post',
    data,
    ...config,
  })
}
