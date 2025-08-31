// Simple storage abstraction with a local stub implementation.
// In production, replace LocalStorage with S3/Supabase implementations.

export type UploadedFile = {
  path: string
  url: string
  contentType?: string
  bytes?: number
}

export interface Storage {
  upload(params: { filename: string; data: Uint8Array; contentType?: string }): Promise<UploadedFile>
}

class LocalMemoryStorage implements Storage {
  private store = new Map<string, Uint8Array>()

  async upload({ filename, data, contentType }: { filename: string; data: Uint8Array; contentType?: string }) {
    const id = crypto.randomUUID()
    const path = `/uploads/${id}-${filename}`
    this.store.set(path, data)
    // In this demo we can't write to disk; return a pseudo-URL served by a future route/static host.
    return { path, url: path, contentType, bytes: data.byteLength }
  }

  // Optional helper to retrieve (not used yet)
  get(path: string) {
    return this.store.get(path)
  }
}

export const storage: Storage = new LocalMemoryStorage()
