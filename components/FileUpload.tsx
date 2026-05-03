'use client'
import { useState, useRef, DragEvent, ChangeEvent } from 'react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [selected, setSelected] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Please upload a file under 5MB.')
      return
    }
    setSelected(file)
    onFileSelect(file)
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const isPdf = selected?.type === 'application/pdf'

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDrop={onDrop}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      className="cursor-pointer rounded-2xl p-8 text-center transition-all duration-200"
      style={{
        background: '#e8edf2',
        boxShadow: dragging
          ? 'inset 5px 5px 12px #c5cad0, inset -5px -5px 12px #ffffff'
          : '6px 6px 14px #c5cad0, -6px -6px 14px #ffffff',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,image/jpeg,image/png"
        className="hidden"
        onChange={onChange}
      />
      {selected ? (
        <div className="flex flex-col items-center gap-3">
          {isPdf ? (
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
            >
              PDF
            </div>
          ) : (
            <img
              src={URL.createObjectURL(selected)}
              alt="preview"
              className="max-h-36 rounded-xl object-contain"
            />
          )}
          <p className="font-medium text-slate-700 text-sm">{selected.name}</p>
          <p className="text-xs text-slate-400">{(selected.size / 1024).toFixed(1)} KB — click to change</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-1"
            style={{ background: '#e8edf2', boxShadow: '4px 4px 10px #c5cad0, -4px -4px 10px #ffffff' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <p className="text-slate-700 font-medium text-sm">Drag & drop or click to upload</p>
          <p className="text-xs text-slate-400">PDF, JPG, or PNG — max 5MB</p>
        </div>
      )}
    </div>
  )
}
