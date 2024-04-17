import fs from 'fs'
import path from 'path'

/**
 * Read the files of a directory recursively until hitting a JSON file
 * @param startPath The path to start reading from
 * @param extName The extension name of the files to read
 * @param exclude Exclude files that include this string
 * @param callback Call your logic here with the path of the JSON file
 * @returns void
 */
export default function readPath(
  {
    startPath,
    exclude,
    include,
    extName = 'json',
  }: { startPath: string; exclude?: string; include?: string; extName: 'json' },
  callback: (itemPath: string) => void
) {
  // Read the items of the directory
  const items = fs.readdirSync(startPath)

  // Iterate over the items
  items.forEach((item) => {
    const itemPath = path.join(startPath, item)
    // Get the stats of the item ( file or directory )
    const stat = fs.statSync(itemPath)

    // If the item is a directory, read its files recursively
    if (stat.isDirectory())
      readPath({ startPath: itemPath, exclude, extName, include }, callback)
    // If the item is a extName file, proceed
    else if (path.extname(item) === `.${extName}`) {
      // If the item includes the exclude string, return the ones who are not excluded
      if (exclude && item.includes(exclude)) return
      // If the item includes the include string, return the ones who are included
      else if (include && !item.includes(include)) return
      // call callback after the conditions
      callback(itemPath)
    }
  })
}
