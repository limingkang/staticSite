import request from '@/utils/fetch'

export function login(data, config = {}) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
    ...config,
  })
}

export function sendRegisterCode(data, config = {}) {
  return request({
    url: '/auth/send-code',
    method: 'post',
    data,
    ...config,
  })
}

export function register(data, config = {}) {
  return request({
    url: '/auth/register',
    method: 'post',
    data,
    ...config,
  })
}

export function getCurrentUserProfile(config = {}) {
  return request({
    url: '/auth/me',
    method: 'get',
    ...config,
  })
}

export function changePassword(data, config = {}) {
  return request({
    url: '/auth/change-password',
    method: 'post',
    data,
    ...config,
  })
}

export function logout(data, config = {}) {
  return request({
    url: '/auth/logout',
    method: 'post',
    data,
    ...config,
  })
}
