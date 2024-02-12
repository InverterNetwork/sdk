import fs from 'fs'
import path from 'path'

const dirname = import.meta.dirname

const deleteFolderRecursive = (path) => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      const curPath = path.join(path, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

const folder = process.argv.slice(2)[0]

if (folder) {
  deleteFolderRecursive(path.join(dirname, '../dist', folder))
} else {
  deleteFolderRecursive(path.join(dirname, '../dist/esm'))
  deleteFolderRecursive(path.join(dirname, '../dist/types'))
}
