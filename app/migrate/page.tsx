'use client'

import { useState } from 'react'

export default function MigratePage() {
  const [status, setStatus] = useState<string>('')
  const [mapping, setMapping] = useState<Record<string, string> | null>(null)
  const [loading, setLoading] = useState(false)

  const runMigration = async () => {
    setLoading(true)
    setStatus('Starting migration...')
    
    try {
      const response = await fetch('/api/migrate-images', {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (data.success) {
        setStatus(`Migration complete! Uploaded ${data.count} images.`)
        setMapping(data.mapping)
      } else {
        setStatus(`Error: ${data.error}`)
      }
    } catch (error) {
      setStatus(`Failed: ${String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Image Migration to Vercel Blob</h1>
      
      <button
        onClick={runMigration}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Migrating...' : 'Start Migration'}
      </button>
      
      <p className="mt-4">{status}</p>
      
      {mapping && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">URL Mapping (copy this):</h2>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto text-sm max-h-96">
            {JSON.stringify(mapping, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
