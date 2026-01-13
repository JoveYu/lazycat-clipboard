import { MiniDB } from '@lazycatcloud/minidb'

const runtimeOrigin =
  typeof window !== 'undefined' && window.location && typeof window.location.origin === 'string'
    ? window.location.origin
    : undefined

// file:// 场景 origin 会是 "null"，此时回退到云端域名，保证多端一致访问
const resolvedOrigin =
  import.meta.env.VITE_MINIDB_ORIGIN ||
  (runtimeOrigin && runtimeOrigin.startsWith('http') ? runtimeOrigin : 'https://clipboard.lazycatcloud.com')

const resolvedPath = import.meta.env.VITE_MINIDB_PATH || '/_lzc/ext/db/'

// 初始化 MiniDB（可通过环境变量覆盖默认的 origin 和 path）
const db = new MiniDB({
  origin: resolvedOrigin,
  urlPath: resolvedPath
})

// 获取剪贴板项目集合
export const clipboardCollection = db.getCollection('clipboard-items')

// 导出 db 实例以便调试使用
export { db }
