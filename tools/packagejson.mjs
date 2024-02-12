import fs from 'fs'
import path from 'path'
import file from '../package.json'

const fileName = '../package.json'
const dirname = import.meta.dirname

const args = process.argv.slice(2)

for (let i = 0, l = args.length; i < l; i++) {
  if (i % 2 === 0) {
    file[args[i]] = args[i + 1]
  }
}

fs.writeFile(
  path.join(dirname, fileName),
  JSON.stringify(file, null, 2),
  (err) => {
    if (err) {
      return console.log(err)
    }
    console.log('Writing to ' + fileName)
  }
)
