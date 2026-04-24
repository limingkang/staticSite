// 判断日期时间间隔相差是否超过限定天数
export const judgeDaysBetweenOverLimit = ({
  startTime,
  endTime,
  dayNumber = 0,
}) => {
  if (!startTime || !endTime) return false
  try {
    const betweenDay = moment(endTime).diff(moment(startTime), 'days')
    return betweenDay >= dayNumber
  } catch (err) {
    console.log(err)
    return false
  }
}

// 导出下载模板 a标签下载
export const downLoadExcel = (url, fileName) => {
  // 创建隐藏的可下载链接
  const element = document.createElement('a')
  element.setAttribute('href', url)
  element.setAttribute('download', fileName)
  // 触发点击
  document.body.appendChild(element)
  element.click()
  // 然后移除
  document.body.removeChild(element)
}
