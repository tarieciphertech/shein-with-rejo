/**
 * Screenshot storage abstraction.
 * Production uses a private Supabase Storage bucket; local disk remains
 * available for development and tests.
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

function storageHeaders(contentType) {
  return {
    apikey: config.supabaseServiceRoleKey,
    Authorization: `Bearer ${config.supabaseServiceRoleKey}`,
    ...(contentType ? { 'Content-Type': contentType } : {}),
  }
}

const supabaseDriver = {
  async save(buffer, extension) {
    const filename = randomName(extension)
    const response = await fetch(
      `${config.supabaseUrl}/storage/v1/object/${config.supabaseBucket}/${filename}`,
      {
        method: 'POST',
        headers: { ...storageHeaders(localDriver.contentType(filename)), 'x-upsert': 'false' },
        body: buffer,
      }
    )
    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      console.error('[storage] Supabase upload failed:', response.status, detail.slice(0, 500))
      throw new Error('Screenshot storage is temporarily unavailable. Please try again.')
    }
    return { filename, size: buffer.length }
  },

  async read(filename) {
    if (!safeNamePattern.test(filename)) return null
    const response = await fetch(
      `${config.supabaseUrl}/storage/v1/object/${config.supabaseBucket}/${filename}`,
      { headers: storageHeaders() }
    )
    if (response.status === 404) return null
    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      console.error('[storage] Supabase download failed:', response.status, detail.slice(0, 500))
      throw new Error('Screenshot storage is temporarily unavailable.')
    }
    return Buffer.from(await response.arrayBuffer())
  },

  contentType: localDriver.contentType,
}

export const storage = config.storageDriver === 'supabase' ? supabaseDriver : localDriver
