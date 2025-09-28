"use client";

import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { ImagePlus, UploadCloud, X } from "lucide-react";
import clsx from "clsx";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse, Painting } from "@/types/api";

interface UploadPaintingFormProps {
  onCreated?: (painting: Painting) => void;
  className?: string;
}

type CloudinaryUploadResult = {
  asset_id: string;
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  original_filename: string;
};

export function UploadPaintingForm({ onCreated, className }: UploadPaintingFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const cloud = useMemo(() => ({
    name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER,
  }), []);

  const isCloudinaryConfigured = Boolean(cloud.name && cloud.preset);
  const missingEnv: string[] = useMemo(() => {
    const m: string[] = [];
    if (!cloud.name) m.push('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
    if (!cloud.preset) m.push('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET');
    return m;
  }, [cloud.name, cloud.preset]);

  const validateAndSetFile = useCallback((f: File | null) => {
    setError(null);
    if (f) {
      const isImage = f.type.startsWith('image/');
      const maxBytes = 10 * 1024 * 1024; // 10MB
      if (!isImage) {
        setError('Please choose a valid image file.');
        setFile(null);
        setPreviewUrl(null);
        return;
      }
      if (f.size > maxBytes) {
        setError('File is too large. Max 10MB.');
        setFile(null);
        setPreviewUrl(null);
        return;
      }
    }
    setFile(f);
  }, []);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    validateAndSetFile(f);
  }, [validateAndSetFile]);

  // Make a small object URL preview for the selected file and clean up when changed
  useEffect(() => {
    if (!file) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const reset = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    setPreviewUrl(null);
  };

  const uploadToCloudinary = useCallback(async (f: File): Promise<CloudinaryUploadResult> => {
    if (!cloud.name || !cloud.preset) throw new Error("Cloudinary env not configured");
    const url = `https://api.cloudinary.com/v1_1/${cloud.name}/image/upload`;
    const form = new FormData();
    form.append("file", f);
    form.append("upload_preset", cloud.preset);
    if (cloud.folder) form.append("folder", cloud.folder);
    const res = await fetch(url, { method: "POST", body: form });
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok) {
      let message = `Cloudinary upload failed (${res.status})`;
      try {
        if (contentType.includes('application/json')) {
          const j = await res.json();
          if (j?.error?.message) message += `: ${j.error.message}`;
        } else {
          const txt = await res.text();
          if (txt) message += `: ${txt}`;
        }
      } catch {
        // ignore parse errors
      }
      throw new Error(message);
    }
    return res.json();
  }, [cloud.folder, cloud.name, cloud.preset]);

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!file) { setError("Please select an image file."); return; }
    if (!title.trim()) { setError("Please enter a title."); return; }
    try {
      setIsUploading(true);
      const uploaded = await uploadToCloudinary(file);
      const payload = { title: title.trim(), description: description.trim() || undefined, imageUrl: uploaded.secure_url };
      const created: ApiResponse<Painting> = await apiClient.createPainting(payload);
      onCreated?.(created.data);
      reset();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  }, [file, title, description, onCreated, uploadToCloudinary]);

  return (
    <form onSubmit={onSubmit} className={clsx("rounded-lg border p-4 space-y-3 bg-background", className)}>
      <div className="space-y-1">
        <label className="text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled masterpiece"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A few words about your painting (optional)"
          rows={3}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Image</label>
        {/* Hidden file input; triggered by dropzone and buttons */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="sr-only"
          aria-hidden
        />

        {/* Dropzone / Preview */}
        {!file ? (
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
            onDrop={(e) => {
              e.preventDefault(); e.stopPropagation(); setIsDragging(false);
              const f = e.dataTransfer?.files?.[0] ?? null;
              validateAndSetFile(f);
            }}
            className={
              `relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors ` +
              (isDragging ? 'border-foreground bg-muted/30' : 'border-muted-foreground/30 hover:border-foreground/60')
            }
            aria-label="Choose image to upload"
          >
            <div className="rounded-full border p-3">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div className="text-sm">
              <span className="font-medium">Click to browse</span> or drag and drop
            </div>
            <div className="text-xs text-muted-foreground">JPG, PNG, or WebP up to 10MB</div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-lg border">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Selected preview" className="h-56 w-full object-cover" />
            ) : (
              <div className="h-56 w-full flex items-center justify-center bg-muted/20"><ImagePlus className="h-8 w-8" /></div>
            )}
            {/* Overlay actions */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/60 to-transparent p-2 text-xs text-white">
              <div className="truncate">{file.name} · {(file.size / 1024).toFixed(0)} KB</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-md bg-white/90 px-2 py-1 text-[11px] font-medium text-black hover:bg-white"
                  onClick={() => inputRef.current?.click()}
                >Change</button>
                <button
                  type="button"
                  aria-label="Remove image"
                  className="rounded-md bg-white/90 p-1 text-black hover:bg-white"
                  onClick={() => { setFile(null); setPreviewUrl(null); if (inputRef.current) inputRef.current.value = ""; }}
                ><X className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        )}

        <p id="image-help" className="text-xs text-muted-foreground">Max ~10MB. JPG/PNG/WebP recommended.</p>
      </div>

      {!isCloudinaryConfigured && (
        <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 p-2 text-xs">
          <div className="font-medium">Missing Cloudinary env.</div>
          <div>Please set the following in <code>.env.local</code> and restart the dev server:</div>
          <ul className="list-disc pl-5 mt-1">
            {missingEnv.map((k) => (<li key={k}><code>{k}</code></li>))}
          </ul>
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isUploading || !file || !title.trim() || !isCloudinaryConfigured}
          aria-busy={isUploading}
          className={clsx("rounded-md px-4 py-2 text-sm font-medium border", isUploading ? "opacity-60 cursor-not-allowed" : "hover:bg-foreground hover:text-background")}
        >
          {isUploading ? "Uploading…" : "Upload & Create"}
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={isUploading}
          className="rounded-md px-3 py-2 text-sm border"
        >Reset</button>
      </div>
    </form>
  );
}
