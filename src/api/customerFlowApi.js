import request from '@/utils/fetch'

export function getCustomerFlowList(params = {}, config = {}) {
  return request({
    url: '/customer-flows',
    method: 'get',
    params,
  })
}

export function getCustomerFlowDetail(id, config = {}) {
  return request({
    url: `/customer-flows/${id}`,
    method: 'get',
  })
}

export function createCustomerFlow(data, config = {}) {
  return request({
    url: '/customer-flows',
    method: 'post',
    data,
  })
}

export function updateCustomerFlow(id, data, config = {}) {
  return request({
    url: `/customer-flows/${id}`,
    method: 'put',
    data,
  })
}

export function deleteCustomerFlow(id, config = {}) {
  return request({
    url: `/customer-flows/${id}`,
    method: 'delete',
  })
}

export function importCustomerFlowExcel(data, config = {}) {
  return request({
    url: '/customer-flows/import',
    method: 'post',
    data,
  })
}

export function exportCustomerFlowExcel(params = {}, config = {}) {
  return request({
    url: '/customer-flows/export',
    method: 'get',
    params,
    responseType: 'blob',
  })
}
