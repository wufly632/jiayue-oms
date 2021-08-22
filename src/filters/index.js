// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'

/**
 * WMS 所有状态
 * @param {String} status
 */
export function statusMap(status) {
  const statusMap = {
    NO_INBOUND: '未入库', // 采购状态 - 未发货
    PARTIAL_INBOUND: '部分入库', // 采购状态 - 未发货
    COMPLETED: '已完成', // 采购状态 - 未发货

    UNSHIPPED: '未发货', // 物流状态 - 未发货
    SHIPPED: '已发货', // 物流状态 - 已发货
    PARTIAL_SHIPPED: '部分发货', // 物流状态 - 部分发货

    OPEN: '打开', // 订单状态 - 打开
    CLOSED: '关闭', // 订单状态 - 关闭

    INBOUND: '入库', // 操作记录 - 入库
    OUTBOUND: '出库', // 操作记录 - 出库
    INVENTORY_CORRECTION: '库存校正', // 操作记录 - 库存校正
    
    CLOSE_PURCHASE_ORDER: '关闭采购单', // 操作记录 - 关闭采购单
    RETURN_PURCHASE_ORDER: '返修退货', // 操作记录 - 采购单返修退货
    
    CLOSE_ORDER: '关闭订单' // 操作记录 - 关闭订单
  }

  return statusMap[status] || ''
}

/**
 * WMS 状态颜色
 * @param {String} status
 */
export function colorStatusMap(status) {
  const colorStatusMap = {
    NO_INBOUND: 'color-partial',
    PARTIAL_INBOUND: 'color-partial',
    COMPLETED: 'color-completed',
    
    UNSHIPPED: 'color-red', // 物流状态 - 未发货
    PARTIAL_SHIPPED: 'color-partial', // 物流状态 - 部分发货
    SHIPPED: 'color-completed', // 物流状态 - 已发货
    
    OPEN: 'color-completed', // 订单状态 - 打开
    CLOSED: 'color-close' // 订单状态 - 关闭

  }

  return colorStatusMap[status] || ''
}

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// 保留两位小数
export function returnFloat(value) {
  value = Math.round(parseFloat(value) * 100) / 100
  const xsd = value.toString().split('.')
  if (xsd.length === 1) {
    value = value.toString() + '.00'
    return value
  }
  if (xsd.length > 1) {
    if (xsd[1].length < 2) {
      value = value.toString() + '0'
    }
    return value
  }
}
// 浮点数 - 加
export function accAdd(arg1, arg2) {
  var r1, r2, m, c

  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }

  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }

  c = Math.abs(r1 - r2)
  m = Math.pow(10, Math.max(r1, r2))
  if (c > 0) {
    var cm = Math.pow(10, c)
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace('.', ''))
      arg2 = Number(arg2.toString().replace('.', '')) * cm
    } else {
      arg1 = Number(arg1.toString().replace('.', '')) * cm
      arg2 = Number(arg2.toString().replace('.', ''))
    }
  } else {
    arg1 = Number(arg1.toString().replace('.', ''))
    arg2 = Number(arg2.toString().replace('.', ''))
  }
  return (arg1 + arg2) / m
}

// 浮点数 - 减
export function accSub(arg1, arg2) {
  var r1, r2, m, n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2)) // last modify by deeka //动态控制精度长度
  n = r1 >= r2 ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

// 浮点数 - 除以
// export function accDiv(arg1, arg2) {
//   var t1 = 0,
//     t2 = 0,
//     r1,
//     r2;
//   try {
//     t1 = arg1.toString().split(".")[1].length;
//   } catch (e) {}
//   try {
//     t2 = arg2.toString().split(".")[1].length;
//   } catch (e) {}
//   r1 = Number(arg1.toString().replace(".", ""));
//   r2 = Number(arg2.toString().replace(".", ""));
//   return r1 / r2 / Math.pow(10, t2 - t1);
// }
export function accDiv(arg1, arg2) {
  var t1 = 0; var t2 = 0; var r1; var r2
  try {
    t1 = arg1.toString().split('.')[1].length
  } catch (e) {
  }
  try {
    t2 = arg2.toString().split('.')[1].length
  } catch (e) {
  }

  r1 = Number(arg1.toString().replace('.', ''))
  r2 = Number(arg2.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}

// 浮点数 - 乘以
export function accMul(arg1, arg2) {
  var m = 0
  var s1 = arg1.toString()
  var s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
  } catch (e) {}
  return (
    (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
    Math.pow(10, m)
  )
}
