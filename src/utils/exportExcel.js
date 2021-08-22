/**
 * 导出
 * @param {Object} options {url: '/api/exportProducts', method: 'post', data: {} }
 */
import request from '@/api/request'

export default function exportExcel(options, that) {
  const loading = that.$loading({
    lock: true,
    text: '正在导出...'
  })

  request(options).then(res => {
    const { code, data } = res
    if (code === 0) { 
      const { path } = data
      window.location.href = path

      that.$message({
        type: 'success',
        message: '导出成功，ZIP文件下载中!'
      })
    }

    loading.close()
  }).catch(() => {
    loading.close()
  })
}