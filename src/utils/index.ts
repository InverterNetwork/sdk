export const getJsType = (type: string) => {
  if (type === 'bool') return 'boolean'
  if (/^u?int/.test(type)) return 'string'
  if (/^u?int.*\[\]$/.test(type)) return 'string[]'
  if (/^bytes/.test(type)) return '0xstring'
  if (/^bytes.*\[\]$/.test(type)) return '0xstring[]'
}
