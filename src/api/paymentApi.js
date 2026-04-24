function padNumber(value) {
  return String(value).padStart(2, '0')
}

function formatDateTime(date = new Date()) {
  const year = date.getFullYear()
  const month = padNumber(date.getMonth() + 1)
  const day = padNumber(date.getDate())
  const hour = padNumber(date.getHours())
  const minute = padNumber(date.getMinutes())
  const second = padNumber(date.getSeconds())
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data))
}

function waitResult(data, delay = 180) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cloneData(data))
    }, delay)
  })
}

function waitError(message, delay = 180) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(message))
    }, delay)
  })
}

function createTradeNo(prefix) {
  const timestamp = Date.now().toString()
  const randomText = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `${prefix}${timestamp.slice(-8)}${randomText}`
}

function findOrderIndex(orderNo) {
  return mockState.testOrders.findIndex((item) => item.orderNo === orderNo)
}

function updateOrderByNo(orderNo, updater) {
  const orderIndex = findOrderIndex(orderNo)
  if (orderIndex === -1) {
    return null
  }

  const currentOrder = mockState.testOrders[orderIndex]
  const nextOrder = typeof updater === 'function'
    ? updater(currentOrder)
    : {
        ...currentOrder,
        ...updater,
      }

  mockState.testOrders.splice(orderIndex, 1, nextOrder)
  return nextOrder
}

const operatorName = '支付运营管理员'
const initialTime = formatDateTime(new Date())

const mockState = {
  channels: [
    {
      id: 'PAY_CH_001',
      code: 'wechat_pay',
      name: '微信支付',
      enabled: true,
      mode: 'production',
      appId: 'wx6d2ab8c9e1f2031d',
      merchantId: '1900000109',
      gateway: '',
      apiV3Key: 'v3-key-example-2026',
      serialNo: '5A9C0D12B31F6E887A41C53F29E1D1A2',
      privateKey: 'wechat-private-key-example',
      alipayPublicKey: '',
      notifyUrl: 'https://api.example.com/payment/wechat/notify',
      returnUrl: 'https://pc.example.com/payment/result',
      scenes: ['Native', 'JSAPI', 'H5'],
      channelRate: '0.60%',
      settlementCycle: 'T+1',
      callbackStatus: '正常',
      callbackLatency: '82ms',
      productDesc: '适合扫码、公众号与移动端支付场景',
      lastUpdatedAt: initialTime,
      lastUpdatedBy: operatorName,
    },
    {
      id: 'PAY_CH_002',
      code: 'alipay',
      name: '支付宝支付',
      enabled: true,
      mode: 'production',
      appId: '2021003187654321',
      merchantId: '2088123412341234',
      gateway: 'https://openapi.alipay.com/gateway.do',
      apiV3Key: '',
      serialNo: '',
      privateKey: 'alipay-private-key-example',
      alipayPublicKey: 'alipay-public-key-example',
      notifyUrl: 'https://api.example.com/payment/alipay/notify',
      returnUrl: 'https://pc.example.com/payment/result',
      scenes: ['PC', 'H5'],
      channelRate: '0.55%',
      settlementCycle: 'T+1',
      callbackStatus: '正常',
      callbackLatency: '94ms',
      productDesc: '适合 PC 收银台、H5 跳转支付场景',
      lastUpdatedAt: initialTime,
      lastUpdatedBy: operatorName,
    },
  ],
  testOrders: [
    {
      orderNo: 'PMT202604170001',
      channelCode: 'wechat_pay',
      channelName: '微信支付',
      scene: 'Native',
      subject: '企业会员续费',
      customerName: '杭州星云科技',
      amount: 299,
      status: '待支付',
      externalTradeNo: createTradeNo('WX'),
      createdAt: initialTime,
      startedAt: '',
      paymentTime: '',
      payUrl: 'weixin://wxpay/bizpayurl?pr=demo-pay-link',
      payDisplayType: 'qrcode',
    },
    {
      orderNo: 'PMT202604170002',
      channelCode: 'alipay',
      channelName: '支付宝支付',
      scene: 'PC',
      subject: '年费套餐升级',
      customerName: '上海海拓数据',
      amount: 599,
      status: '支付成功',
      externalTradeNo: createTradeNo('ALI'),
      createdAt: initialTime,
      startedAt: initialTime,
      paymentTime: initialTime,
      payUrl: 'https://openapi.alipay.com/gateway.do?mock=pay-demo',
      payDisplayType: 'redirect',
    },
  ],
}

export function fetchPaymentChannels() {
  return waitResult(mockState.channels)
}

export function fetchPaymentTestOrders() {
  return waitResult(mockState.testOrders)
}

export function updatePaymentChannelStatus({ id, enabled }) {
  const channelIndex = mockState.channels.findIndex((item) => item.id === id)
  if (channelIndex === -1) {
    return waitError('未找到对应的支付渠道')
  }

  const currentChannel = mockState.channels[channelIndex]
  const nextChannel = {
    ...currentChannel,
    enabled: Boolean(enabled),
    callbackStatus: enabled ? '正常' : '停用',
    callbackLatency: enabled ? currentChannel.callbackLatency || '90ms' : '--',
    lastUpdatedAt: formatDateTime(new Date()),
    lastUpdatedBy: operatorName,
  }

  mockState.channels.splice(channelIndex, 1, nextChannel)
  return waitResult(nextChannel)
}

export function savePaymentChannelConfig(payload) {
  const channelIndex = mockState.channels.findIndex((item) => item.id === payload.id)
  if (channelIndex === -1) {
    return waitError('未找到对应的支付渠道')
  }

  const currentChannel = mockState.channels[channelIndex]
  const nextChannel = {
    ...currentChannel,
    ...cloneData(payload),
    callbackStatus: payload.enabled ? (currentChannel.callbackStatus === '停用' ? '正常' : currentChannel.callbackStatus) : '停用',
    callbackLatency: payload.enabled ? (payload.callbackLatency || currentChannel.callbackLatency || '88ms') : '--',
    lastUpdatedAt: formatDateTime(new Date()),
    lastUpdatedBy: operatorName,
  }

  mockState.channels.splice(channelIndex, 1, nextChannel)
  return waitResult(nextChannel)
}

export function createPaymentTestOrder(payload) {
  const targetChannel = mockState.channels.find((item) => item.code === payload.channelCode)
  if (!targetChannel) {
    return waitError('支付渠道不存在，请先检查配置')
  }

  if (!targetChannel.enabled) {
    return waitError(`${targetChannel.name} 尚未启用，无法创建测试订单`)
  }

  const now = new Date()
  // 这里是演示订单数据，模拟后端调用微信或支付宝统一下单后，
  // 返回给前端的支付订单信息。
  const order = {
    orderNo: `PMT${now.getFullYear()}${padNumber(now.getMonth() + 1)}${padNumber(now.getDate())}${padNumber(mockState.testOrders.length + 1)}`,
    channelCode: targetChannel.code,
    channelName: targetChannel.name,
    scene: payload.scene,
    subject: payload.subject,
    customerName: payload.customerName,
    amount: Number(payload.amount),
    status: '待支付',
    externalTradeNo: targetChannel.code === 'wechat_pay' ? createTradeNo('WX') : createTradeNo('ALI'),
    createdAt: formatDateTime(now),
    startedAt: '',
    paymentTime: '',
    payUrl: targetChannel.code === 'wechat_pay'
      ? `weixin://wxpay/bizpayurl?pr=${createTradeNo('QR')}`
      : `https://openapi.alipay.com/gateway.do?tradeNo=${createTradeNo('ALI')}`,
    payDisplayType: targetChannel.code === 'wechat_pay' ? 'qrcode' : 'redirect',
  }

  mockState.testOrders.unshift(order)
  mockState.testOrders = mockState.testOrders.slice(0, 12)
  return waitResult(order)
}

export function startPaymentTestOrder({ orderNo }) {
  // 演示环境里，先把订单切到“支付中”状态，
  // 模拟第三方支付回调到达前的中间过程。
  const updatedOrder = updateOrderByNo(orderNo, (currentOrder) => ({
    ...currentOrder,
    status: currentOrder.status === '支付成功' ? currentOrder.status : '支付中',
    startedAt: currentOrder.startedAt || formatDateTime(new Date()),
  }))

  if (!updatedOrder) {
    return waitError('未找到对应的测试订单')
  }

  return waitResult(updatedOrder)
}

export function completePaymentTestOrder({ orderNo }) {
  // 演示环境里，模拟后端已经收到并确认了
  // 微信支付或支付宝的异步成功通知。
  const updatedOrder = updateOrderByNo(orderNo, (currentOrder) => ({
    ...currentOrder,
    status: '支付成功',
    startedAt: currentOrder.startedAt || formatDateTime(new Date()),
    paymentTime: formatDateTime(new Date()),
  }))

  if (!updatedOrder) {
    return waitError('未找到对应的测试订单')
  }

  return waitResult(updatedOrder)
}
