import fs from 'fs'
import path from 'path'

const dirname = import.meta.dirname

const logsPath = path.join(dirname, '../logs')

export default function writeLog({
  content,
  label,
  format = 'json',
}: {
  content: any
  label?: string
  format?: 'json' | 'html'
}) {
  if (!fs.existsSync(logsPath)) fs.mkdirSync(logsPath, { recursive: true })

  const now = new Date(),
    date = now.getDate(),
    month = now.getMonth() + 1,
    year = now.getFullYear().toString().slice(2),
    hours = now.getHours(),
    minutes = now.getMinutes(),
    seconds = now.getSeconds()

  const timestamp = `${date}-${month}-${year}_${hours}:${minutes}:${seconds}`

  const formattedLabel = label ? `${timestamp}-${label}` : timestamp

  const newFilePath = path.join(logsPath, `${formattedLabel}.json`)

  let fileContent: string
  if (format === 'json') {
    fileContent = JSON.stringify(content, null, 2)
  } else if (format === 'html') {
    // Convert content to HTML here
    fileContent = content // replace this with your HTML conversion logic
  } else throw new Error("Invalid format provided. Use 'json' or 'html'")

  fs.writeFileSync(newFilePath, fileContent)
}
