import fs from 'fs'
import path from 'path'

const logsPath = path.join(__dirname, '../../logs')

export default function writeToFile(jsonProp: any) {
  if (!fs.existsSync(logsPath)) fs.mkdirSync(logsPath, { recursive: true })

  const newFilePath = path.join(
    logsPath,
    `${(Number(Date.now().toString()) / 1000).toFixed(0)}.log.json`
  )

  fs.writeFileSync(newFilePath, JSON.stringify(jsonProp, null, 2))
}
