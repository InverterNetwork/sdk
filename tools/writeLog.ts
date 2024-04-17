import fs from 'fs'
import path from 'path'

const dirname = import.meta.dirname

const logsPath = path.join(dirname, '../logs')

export default function ({
  content,
  label,
  format = 'json',
}: {
  content: any
  label?: string
  format?: 'json' | 'html'
}) {
  if (!fs.existsSync(logsPath)) fs.mkdirSync(logsPath, { recursive: true })

  const timestamp = (Number(Date.now().toString()) / 1000).toFixed(0).slice(6)
  const optionalLabel = label ? `${timestamp}-${label}` : timestamp

  const newFilePath = path.join(logsPath, `${optionalLabel}.log.${format}`)

  let fileContent: string
  if (format === 'json') {
    fileContent = JSON.stringify(content, null, 2)
  } else if (format === 'html') {
    // Convert content to HTML here
    fileContent = content // replace this with your HTML conversion logic
  } else throw new Error("Invalid format provided. Use 'json' or 'html'")

  fs.writeFileSync(newFilePath, fileContent)
}
