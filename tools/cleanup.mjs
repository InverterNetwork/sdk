import fs from 'fs'
import path from 'path'

const dirname = import.meta.dirname

const deleteFolderRecursive = (folderPath) => {
  // Renamed path to folderPath
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file) // Use folderPath instead of path
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(folderPath) // Use folderPath instead of path
  }
}

const folder = process.argv.slice(2)[0]

if (folder) {
  deleteFolderRecursive(path.join(dirname, '../dist', folder))
} else {
  deleteFolderRecursive(path.join(dirname, '../dist/esm'))
  deleteFolderRecursive(path.join(dirname, '../dist/types'))
}
