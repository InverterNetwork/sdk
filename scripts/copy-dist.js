const fs = require('fs')
const path = require('path')

const sourcePath = path.resolve('./dist')
const targetPath = process.argv[2]

if (!targetPath) {
  console.error('Please provide a target path as an argument.')
  process.exit(1)
}

try {
  fs.cpSync(sourcePath, targetPath, { recursive: true })
  console.log(`Successfully copied dist folder to ${targetPath}`)
} catch (err) {
  console.error('Error copying dist folder:', err)
  process.exit(1)
}
