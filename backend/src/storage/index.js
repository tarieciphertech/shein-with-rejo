/**
 * Storage abstraction for order screenshots.
 *
 * The default driver stores files on local disk with random, unguessable
 * names. For production, implement the same interface against object
 * storage (e.g. S3, Cloudflare R2, Backblaze B2) and select it with an
 * environment variable — no other code needs to change.
 */
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { config } from '../config.js'

const safeNamePattern = /^[a-f0-9]{32}\.(jpg|png|webp)$/i

function randomName(extension) {
  return `${crypto.randomBytes(16).toString('hex')}.${extension}`
}

const localDriver = {
  async save(buffer, extension) {
    const filename = randomName(extension)
    await fs.writeFile(path.join(config.uploadDir, filename), buffer)
    return { filename, size: buffer.length }
  },

  /** Returns the file buffer, or null if it does not exist. */
  async read(filename) {
    if (!safeNamePattern.test(filename)) return null
    try {
      return await fs.readFile(path.join(config.uploadDir, path.basename(filename)))
    } catch {
      return null
    }
  },

  contentType(filename) {
    const ext = filename.split('.').pop().toLowerCase()
    return { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }[ext] || 'application/octet-stream'
  },
}

// TODO(production): add an S3-compatible driver. Required environment
// variables will be S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY.
export const storage = localDriver
