import { MiniDB } from '@lazycatcloud/minidb'

const runtimeOrigin =
  typeof window !== 'undefined' && window.location && typeof window.location.origin === 'string'
    ? window.location.origin
    : ''

const runtimeHost =
  typeof window !== 'undefined' && window.location && typeof window.location.host === 'string'
    ? window.location.host
    : ''

// 简单环境校验：必须在 heiyu.space 域下运行，否则提示无法写入
if (!runtimeHost.includes('heiyu.space')) {
  console.warn(
    '[MiniDB] 当前环境非 heiyu.space 域，数据不会写入远端 MiniDB，请在懒猫微服务环境中运行。'
  )
}

const db = new MiniDB({
  origin: runtimeOrigin,
  urlPath: '/_lzc/ext/db/'
})

// 获取剪贴板项目集合
export const clipboardCollection = db.getCollection('clipboard-items')

// 导出 db 实例以便调试使用
export { db }
