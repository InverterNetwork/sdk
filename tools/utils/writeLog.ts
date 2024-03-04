import fs from 'fs'
import path from 'path'

const logsPath = path.join(__dirname, '../../logs')

export default function writeToFile(jsonProp: any, label?: string) {
  if (!fs.existsSync(logsPath)) fs.mkdirSync(logsPath, { recursive: true })

  const timestamp = (Number(Date.now().toString()) / 1000).toFixed(0).slice(6)
  const optionalLabel = label ? `${label}-${timestamp}` : timestamp

  const newFilePath = path.join(logsPath, `${optionalLabel}.log.json`)

  fs.writeFileSync(newFilePath, JSON.stringify(jsonProp, null, 2))
}
