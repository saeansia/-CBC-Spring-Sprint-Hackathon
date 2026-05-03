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
      className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
        dragging ? 'border-blue-400 bg-blue-50' : 'border-blue-200 bg-white hover:border-blue-400 hover:bg-blue-50'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,image/jpeg,image/png"
        className="hidden"
        onChange={onChange}
      />
      {selected ? (
        <div className="flex flex-col items-center gap-2">
          {isPdf ? (
            <div className="text-4xl">📄</div>
          ) : (
            <img
              src={URL.createObjectURL(selected)}
              alt="preview"
              className="max-h-40 rounded-lg object-contain"
            />
          )}
          <p className="font-medium text-blue-800">{selected.name}</p>
          <p className="text-xs text-gray-400">{(selected.size / 1024).toFixed(1)} KB — click to change</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <div className="text-4xl">☁️</div>
          <p className="text-blue-700 font-medium">Drag & drop or click to upload</p>
          <p className="text-xs">PDF, JPG, or PNG — max 5MB</p>
        </div>
      )}
    </div>
  )
}
