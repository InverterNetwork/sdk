import type { PrunedFile } from '@/types'

/**
 * Converts a File to a base64 string
 * @param file - The file to convert
 * @returns Promise resolving to pruned file object containing base64 string, type and name
 * @throws Error if no file is provided
 */
export async function pruneFile(file?: Blob | File): Promise<PrunedFile> {
  if (!file) throw new Error('No file selected')

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return {
    string: buffer.toString('base64'),
    type: file.type,
    name: 'name' in file ? file.name : 'file',
  }
}

/**
 * Reconstructs a File from a base64 string
 * @param param0 - Object containing base64 string, type and name
 * @param param0.string - Base64 encoded file data
 * @param param0.type - MIME type of the file
 * @param param0.name - Name of the file
 * @returns Reconstructed File object
 */
export function parseFile({ string, type, name }: PrunedFile): File {
  const buffer = Buffer.from(string, 'base64')
  return new File([buffer], name, { type })
}
