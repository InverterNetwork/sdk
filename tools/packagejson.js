/* eslint-disable */
const fs = require('fs')
const Path = require('path')
const fileName = '../package.json'
const file = require(fileName)
/* eslint-enable */

const dirname = import.meta.dir

const args = process.argv.slice(2)

for (let i = 0, l = args.length; i < l; i++) {
  if (i % 2 === 0) {
    file[args[i]] = args[i + 1]
  }
}

fs.writeFile(
  Path.join(dirname, fileName),
  JSON.stringify(file, null, 2),
  (err) => {
    if (err) {
      return console.log(err)
    }
    console.log('Writing to ' + fileName)
  }
)
