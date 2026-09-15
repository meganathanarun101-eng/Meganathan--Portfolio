import React, { useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2, UploadCloud, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  value?: string;
  onChange?: (url: string) => void;
  multiple?: boolean;
  galleryValues?: string[];
  onGalleryChange?: (urls: string[]) => void;
  className?: string;
  label?: string;
}

export function ImageUploader({
  value,
  onChange,
  multiple = false,
  galleryValues = [],
  onGalleryChange,
  className,
  label = 'Upload Image',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = (file: File, callback: (resultUrl: string) => void) => {
    setUploading(true);
    setUploadProgress(15);

    const reader = new FileReader();
    reader.onload = (e) => {
      const resultUrl = e.target?.result as string;

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            setTimeout(() => {
              setUploading(false);
              setUploadProgress(0);
              callback(resultUrl);
              toast.success(`Image "${file.name}" uploaded successfully`);
            }, 300);
            return 100;
          }
          return prev + 25;
        });
      }, 100);
    };
    reader.readAsDataURL(file);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (multiple && onGalleryChange) {
      Array.from(files).forEach((file) => {
        simulateUpload(file, (url) => {
          onGalleryChange([...galleryValues, url]);
        });
      });
    } else if (onChange) {
      const file = files[0];
      if (file) {
        simulateUpload(file, (url) => {
          onChange(url);
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeGalleryImage = (index: number) => {
    if (onGalleryChange) {
      const updated = galleryValues.filter((_, i) => i !== index);
      onGalleryChange(updated);
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {value && !multiple && (
          <button
            type="button"
            onClick={() => onChange?.('')}
            className="inline-flex items-center gap-1 text-xs text-rose-400 hover:underline"
          >
            <Trash2 className="h-3 w-3" /> Remove
          </button>
        )}
      </div>

      {/* Single preview */}
      {!multiple && value && (
        <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          <img src={value} alt="Uploaded preview" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-xs font-semibold backdrop-blur-md hover:bg-white/30"
            >
              <UploadCloud className="h-4 w-4" /> Replace Image
            </button>
          </div>
        </div>
      )}

      {/* Upload Zone */}
      {(!value || multiple) && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200',
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-white/15 bg-white/[0.02] hover:border-primary/50 hover:bg-white/[0.04]',
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {uploading ? (
            <div className="w-full max-w-xs space-y-2 py-4">
              <div className="flex items-center justify-center gap-2 text-sm text-primary">
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading image... {uploadProgress}%
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-primary transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary">
                <ImagePlus className="h-6 w-6" />
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP, or GIF (up to 10MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Multiple gallery previews */}
      {multiple && galleryValues.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {galleryValues.map((imgUrl, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/30"
            >
              <img src={imgUrl} alt={`Gallery ${i}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeGalleryImage(i);
                }}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity hover:bg-rose-600 group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
