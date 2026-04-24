import request from '@/utils/fetch'

export function getMenuTree(config = {}) {
  return request({
    url: '/menus/tree',
    method: 'get',
    ...config,
  })
}

export function getMyMenuTree(config = {}) {
  return request({
    url: '/menus/my-tree',
    method: 'get',
    ...config,
  })
}

export function getMenuDetail(id, config = {}) {
  return request({
    url: `/menus/${id}`,
    method: 'get',
    ...config,
  })
}

export function createMenu(data, config = {}) {
  return request({
    url: '/menus',
    method: 'post',
    data,
    ...config,
  })
}

export function updateMenu(id, data, config = {}) {
  return request({
    url: `/menus/${id}`,
    method: 'put',
    data,
    ...config,
  })
}

export function deleteMenu(id, config = {}) {
  return request({
    url: `/menus/${id}`,
    method: 'delete',
    ...config,
  })
}
